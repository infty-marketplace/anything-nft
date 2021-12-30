const Nft = require("../models/nft");
const Album = require("../models/album");

const Transaction = require("../models/transaction");
const User = require("../models/user");
const constants = require("../constants");
const sha256 = require("sha256-file");
const { makeid } = require("../utils/helpers");
const imageUtils = require("../utils/imageUtils");
const mongodbUtils = require("../utils/mongodbUtils");
const cfxUtils = require("../utils/cfxUtils");
const s3Utils = require("../utils/s3Utils");


// return a list of on sale NFT's id from cursor position, limit amount
const getMarket = async (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({ error: "invalid request" });
  }

  const limit = body.limit || 10;
  const offset = body.offset || 0;

  const nftQuery = Nft.find({ status: constants.STATUS_SALE }, { nft_id: 1 })
  .sort({ nft_id: "desc" })
  .skip(offset)
  .limit(limit)
    
  const albumQuery = Album.find(
    { status: constants.STATUS_SALE },
    { album_id: 1 }
  )
    .sort({ album_id: "desc" })
    .skip(offset)
    .limit(limit);

  res.send({
    nft_ids: (await nftQuery.exec()).map((n) => n.nft_id),
    album_ids: (await albumQuery.exec()).map((n) => n.album_id)
  });
};

// get nft_id
const getNft = async (req, res) => {
    const nft = await Nft.findOne({ nft_id: req.params.nft_id });
    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    res.send(nft);
};

async function createNft(req, res) {
    console.log("Create NFT");
    const titleExists = await Nft.exists({ title: req.body.title });
    if (titleExists) {
        return res.status(409).send(); // 409: Conflict response status
    }
    // compare image similarity
    const tmpPath = req.files.file.path;
    const fileHash = await imageUtils.hash(tmpPath);

    for await (const nft of Nft.find({})) {
        if (imageUtils.calculateSimilarity(nft.file_hash, fileHash) >= process.env.IMAGE_SIMILARITY_THRESHOLD) {
            return res.status(400).json({ error: "file already exists" });
        }
    }

    // upload image to s3
    console.log(sha256(tmpPath));
    const sha = sha256(tmpPath);
    const location = await s3Utils.uploadImage(tmpPath, makeid(16))

    // create nft on chain
    const guessedTokenId = await cfxUtils.nextTokenId();
    const uri = await cfxUtils.generateUri(req, location, sha);
    await cfxUtils.mint(req.body.address, uri);
    const actualTokenId = cfxUtils.actualTokenId(req.body.address, uri, guessedTokenId);
    const nftId = process.env.MINTER_ADDRESS + "-" + guessedTokenId;
    const params = {
        title: req.body.title,
        nft_id: nftId,
        description: req.body.description,
        file: location,
        file_hash: fileHash,
        status: constants.STATUS_PRIVATE,
        author: req.body.address,
        owner: [{ address: req.body.address, percentage: 1 }],
    };

    const newNft = new Nft(params);
    const user = await User.findOne({ address: req.body.address });
    user.nft_ids.push(nftId);

    await mongodbUtils
        .saveAll([newNft, user])
        .then(() => {
            return res.send("File uploaded successfully");
        })
        .catch((error) => {
            return res.status(422).json({ error: error.message });
        });
}

// list NFT to change status to sale
async function listNft(req, res) {
    const nftId = req.body.nft_id;
    const nft = await Nft.findOne({nft_id: nftId})
    // if this nft has more owners, then it's fragmented
    await Nft.findOneAndUpdate({nft_id: nftId}, {status: constants.STATUS_SALE})

    Nft.findOneAndUpdate(
        { nft_id: nftId },
        {
            status: constants.STATUS_SALE,
            price: req.body.price,
            currency: req.body.currency,
            fractional: req.body.fractional
        },
        (err) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.send("Status changed to sale");
        }
    );
    
    
}

// delist the nft to change the status to private
async function delistNft(req, res) {
    const nftId = req.body.nft_id;
    const nft = await Nft.findOne({nft_id: nftId})
    
    Nft.findOneAndUpdate({ nft_id: nftId }, { status: constants.STATUS_PRIVATE }, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.send("Status changed to pivate");
    });
}

// get a list of nfts given an album
async function getAlbumNfts(album) {
    let nfts = [];
    for (const id of album.nft_ids) {
        const nft = await Nft.findOne({ nft_id: id });
        nfts.push(nft);
    }
    return nfts;
}

// return a list of owners given nft and an optional boolean parameter {addressOnly}
function getNftOwners(nft, addressOnly = true) {
    const owners = nft.owner.filter((element) => {
        return element.percentage === 1;
    });
    if (addressOnly) {
        return owners.map((element) => {
            return element.address;
        });
    }
    return owners;
}

// return a list of funders for {nft}, and default {addressOnly} is true
function getNftFunders(nft, addressOnly = true) {
    const funders = nft.owner.filter((element) => {
        return element.percentage !== 1;
    });
    if (addressOnly) {
        return funders.map((element) => {
            return element.address;
        });
    }
    return funders;
}

// return an {unique} list of owners given a list of {nfts} with {addressOnly}
function getNftListOwners(nfts, addressOnly = true, unique = true) {
    let owners = [];
    for (const nft of nfts) {
        owners = [...owners, ...getNftOwners(nft, addressOnly)];
    }
    if (unique) {
        return [...new Set(owners)];
    }
    return owners;
}

// transferOwnership according to transferOwnership, {recordTransaction} is true by default
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
    } else if (transactionDetails.transaction_type === "fund-nft") {
        collection = await Nft.findOne({
            nft_id: transactionDetails.collection_id,
        });
        const index = [...getNftOwners(collection), ...getNftFunders(collection)].indexOf(transactionDetails.buyer);
        if (index >= 0) {
            collection.owner[index].percentage += transactionDetails.percentage;
        } else {
            collection.owner.push({
                address: transactionDetails.buyer,
                percentage: transactionDetails.percentage,
            });
        }
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

// purchase nft by specifying nft_id in request body
async function purchaseNft(req, res) {
    const body = req.body;
    let nft = await Nft.findOne({ nft_id: body.nft_id });

    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    if (nft.status !== constants.STATUS_SALE) {
        return res.status(400).json({ error: "ntf is not for sale" });
    }
    if (getNftOwners(nft).includes(body.buyer)) {
        return res.status(400).json({ error: "buyer is the owner" });
    }

    const tokenID = body.nft_id.split("-")[1];
    await cfxUtils.transferOwnershipOnChain(nft.owner[0].address, body.buyer, tokenID);

    // create a transaction record
    let transactionDetails = {
        buyer: body.buyer,
        seller: nft.owner[0].address,
        transaction_type: "purchase-nft",
        price: nft.price,
        currency: nft.currency,
        commission: body.commission,
        commission_currency: body.commission_currency,
        collection_id: nft.nft_id,
    };
    try {
        transferOwnership(transactionDetails);
    } catch (error) {
        return res.status(404).send(error);
    }

    //check if this nft fullfills a album
    if (nft.album_id && nft.album_id !== "") {
        let album = await Album.findOne({ album_id: nft.album_id });
        // if every nft is not completely funded and every nft's owner is the same
        const nfts = await getAlbumNfts(album);
        if (!(getNftListOwners(nfts).length === 1)) {
            const albumTransactionDetails = {
                buyer: body.buyer,
                seller: nft.owner[0].address,
                transaction_type: "purchase-nft",
                price: nft.price,
                currency: nft.currency,
                commission: body.commission,
                commission_currency: body.commission_currency,
                collection_id: nft.nft_id,
            };
            try {
                transferOwnership(transactionDetails);
            } catch (error) {
                return res.status(404).send(error);
            }

        }
    }
    res.status(200).send();
    await cfxUtils.transferCfxTo(nft.owner[0].address, parseFloat(nft.price));    
}

module.exports = {
    getMarket,
    getNft,
    createNft,
    listNft,
    delistNft,
    purchaseNft,
};
