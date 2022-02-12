const Nft = require("../models/nft");
const Album = require("../models/album");

const Transaction = require("../models/transaction");
const User = require("../models/user");

const constants = require("../constants");
const fs = require("fs");
const sha256 = require("sha256-file");
const { makeid } = require("../utils/helpers");
const imageUtils = require("../utils/imageUtils");
const mongodbUtils = require("../utils/mongodbUtils");
const cfxUtils = require("../utils/cfxUtils");
const s3Utils = require("../utils/s3Utils");
const s3 = require("../database/s3");


// get album by album_id
const getAlbum = async (req, res) => {
    const album = await Album.findOne({ album_id: req.params.album_id });
    if (!album) {
        return res.status(404).json({ error: "album not found" });
    }
    res.send(album);
};

// create a new album
async function createAlbum(req, res) {
    // obtain the list of nfts that will be included in the new album
    const nft_ids = JSON.parse(req.body.nft_ids);
    // generate an album_id
    let album_id = makeid(16);
    const tmp_path = req.files.file.path;
    const fileToUpload = fs.createReadStream(tmp_path);
    const sha = sha256(tmp_path);

    const s3UploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: album_id,
        Body: fileToUpload,
    };

    const data = await s3.upload(s3UploadParams).promise();
    const uploadedUrl = data.Location;
    const guessedTokenId = await cfxUtils.nextTokenId();
    const uri = await cfxUtils.generateAlbumUri(req, uploadedUrl, sha);
    await cfxUtils.mint(process.env.MANAGER_ADDRESS, uri);
    const actualTokenId = cfxUtils.actualTokenId(req.body.address, uri, guessedTokenId);
    album_id = process.env.MINTER_ADDRESS + "-" + guessedTokenId;

    const params = {
        title: req.body.title,
        album_id: album_id,
        description: req.body.description,
        file: uploadedUrl,
        status: constants.STATUS_PRIVATE,

        nft_ids: nft_ids,
        owner: req.body.address,
        author: req.body.address,
    };

    try {
        // save new album to database
        const newAlbum = await new Album(params).save();

        // assign each nft in the list of nft_ids to the new created album
        for (const nid of nft_ids) {
            const n = await Nft.findOne({ nft_id: nid });
            n.album_id = album_id;
            await n.save();
        }
        // associate a album to an user 
        const u = await User.findOne({ address: req.body.address });
        await User.findOneAndUpdate({ address: req.body.address }, { album_ids: [album_id, ...u.album_ids] });
        // TODO: If fail, revert changes
        res.send(newAlbum);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

// change each nft's status in the album to sale
async function listAlbum(req, res) {
    const album_id = req.body.album_id;
    let album = await Album.findOne({ album_id });

    for (const nft_id of album.nft_ids) {
        await Nft.findOneAndUpdate(
            { nft_id },
            { status: constants.STATUS_SALE, currency: "cfx", price: req.body.nft_prices[nft_id] }
        );
    }
    album.status = constants.STATUS_SALE;
    album.price = req.body.price;
    album.currency = "cfx";
    album = await album.save();

    return res.send(album);
}

// change each nft's status in the album back to private
async function delistAlbum(req, res) {
    const album_id = req.body.album_id;
    let album = await Album.findOne({ album_id });
    for (const nft_id of album.nft_ids) {
        await Nft.findOneAndUpdate({ nft_id }, { status: constants.STATUS_PRIVATE });
    }
    album.status = constants.STATUS_PRIVATE;
    album = await album.save();
    return res.send(album);
}

// get a list of nft_ids included in the album
async function getAlbumNfts(album) {
    let nfts = [];
    for (const id of album.nft_ids) {
        const nft = await Nft.findOne({ nft_id: id });
        nfts.push(nft);
    }
    return nfts;
}

async function transferOwnership(transactionDetails, recordTransaction = true) {
    // get buyer/seller
    let buyer = await User.findOne({ address: transactionDetails.buyer });
    let seller = await User.findOne({ address: transactionDetails.seller });

    if (!buyer || !seller) {
        throw new Error("user not found");
    }

    let collectionType = "";
    if (transactionDetails.transaction_type === "purchase-album") {
        collectionType = "album";
    } else if (
        transactionDetails.transaction_type === "purchase-nft" ||
        transactionDetails.transaction_type === "fund-nft" ||
        transactionDetails.transaction_type === "draw-nft" ||
        transactionDetails.transaction_type === "win-nft"
    ) {
        collectionType = "nft";
    }

    // add collection to buyer if collection not already exist
    if (!buyer[`${collectionType}_ids`].includes(transactionDetails.collection_id)) {
        buyer[`${collectionType}_ids`].push(transactionDetails.collection_id);
    }
    // remove collection from seller if exist
    const index = seller[`${collectionType}_ids`].indexOf(transactionDetails.collection_id);
    if (index !== -1) {
        seller[`${collectionType}_ids`].splice(index, 1);
    }

    // get collection and update collection's owner
    let collection = null;
    if (transactionDetails.transaction_type === "purchase-album") {
        collection = await Album.findOne({
            album_id: transactionDetails.collection_id,
        });
        collection.owner = transactionDetails.buyer;
    } else if (
        transactionDetails.transaction_type === "purchase-nft" ||
        transactionDetails.transaction_type === "draw-nft" ||
        transactionDetails.transaction_type === "win-nft"
    ) {
        collection = await Nft.findOne({
            nft_id: transactionDetails.collection_id,
        });
        collection.owner = [{ address: transactionDetails.buyer, percentage: 1 }];
    } 

    // update collection's status
    collection.status = constants.STATUS_PRIVATE;

    // save document changes
    let documents = [collection, buyer, seller];
    if (recordTransaction) {
        const transaction = new Transaction(transactionDetails);
        documents.push(transaction);
    }
    await mongodbUtils
        .saveAll(documents)
        .then(() => {
            return;
        })
        .catch((error) => {
            throw error;
        });
}

async function purchaseAlbum(req, res) {
    const body = req.body;
    let album = await Album.findOne({ album_id: body.album_id });

    if (!album) {
        return res.status(404).json({ error: "album not found" });
    }
    if (album.status !== constants.STATUS_SALE) {
        return res.status(400).json({ error: "album is not for sale" });
    }
    if (album.owner === body.buyer) {
        return res.status(400).json({ error: "buyer is the owner" });
    }

    await cfxUtils.transferOwnershipOnChain(process.env.MANAGER_ADDRESS, body.buyer, album.album_id.split("-")[1]);

    // create a transaction record
    const transactionDetails = {
        buyer: body.buyer,
        seller: album.owner,
        transaction_type: "purchase-album",
        price: album.price,
        currency: album.currency,
        commission: body.commission,
        commission_currency: body.commission_currency || "cfx",
        collection_id: album.album_id,
    };
    try {
        // transfer ownership
        await transferOwnership(transactionDetails);
    } catch (error) {
        console.log(error);
        return res.status(404).send(error);
    }

    //update associated nft's information
    const nfts = await getAlbumNfts(album);
    for (const nft of nfts) {
        const nftTransactionDetails = {
            buyer: body.buyer,
            seller: album.owner,
            transaction_type: "purchase-nft",
            collection_id: nft.nft_id,
        };

        try {
            await cfxUtils.transferOwnershipOnChain(album.owner, body.buyer, nft.nft_id.split("-")[1]);
            await transferOwnership(nftTransactionDetails, false);
        } catch (error) {
            return res.status(404).send(error);
        }
    }

    return res.status(200).send();
}

module.exports = {
    getAlbum,
    createAlbum,
    listAlbum,
    delistAlbum,
    purchaseAlbum,
};
