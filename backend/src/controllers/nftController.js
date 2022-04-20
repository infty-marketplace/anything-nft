const Nft = require("../models/nft");

const Transaction = require("../models/transaction");
const User = require("../models/user");
const constants = require("../constants");
const imageUtils = require("../utils/imageUtils");
const mongodbUtils = require("../utils/mongodbUtils");
const nftStorageUtils = require("../utils/nftStorageUtils");
const cfxUtils = require("../utils/cfxUtils");

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
        .limit(limit);

    res.send({
        nft_ids: (await nftQuery.exec()).map((n) => n.nft_id),
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

// update views according to the nft_id provided in the url, update the database
const updateViews = async (req, res) => {
    const nftId = req.params.nft_id;
    const nft = await Nft.findOne({ nft_id: nftId });
    await Nft.findOneAndUpdate({ nft_id: nftId }, { views: nft.views + 1 });
    res.send({ views: nft.views + 1 });
};

const likeNft = async (req, res) => {
    const nftId = req.body.nft_id;
    const address = req.body.address;
    await User.findOneAndUpdate({ address: address }, { $push: { liked_nfts: nftId } });
    await Nft.findOneAndUpdate({ nft_id: nftId }, { $push: { liked_users: address } });
    return res.status(200).send();
};

const unlikeNft = async (req, res) => {
    const nftId = req.body.nft_id;
    const address = req.body.address;
    await User.findOneAndUpdate({ address: address }, { $pull: { liked_nfts: nftId } });
    await Nft.findOneAndUpdate({ nft_id: nftId }, { $pull: { liked_users: address } });
    return res.status(200).send();
};

async function createNft(req, res) {
    const address = req.body.address;
    const titleExists = await Nft.exists({ title: req.body.title });
    if (titleExists) {
        return res.status(409).send();
    }

    const filePath = req.files.file.path;

    // compare image similarity
    const fileHash = await imageUtils.hash(filePath);
    const nfts = await Nft.find({}, { file_hash: 1, _id: 0 });
    for (const nft of nfts) {
        if (imageUtils.calculateSimilarity(nft.file_hash, fileHash) >= process.env.IMAGE_SIMILARITY_THRESHOLD) {
            return res.status(400).json({ error: "file already exists" });
        }
    }

    // upload image to nft storage
    const metadataUrl = await nftStorageUtils.upload(filePath, req.body.title, req.body.description);

    // create nft on chain
    let [_, imageUrl] = await Promise.all([
        cfxUtils.mint(address, metadataUrl),
        nftStorageUtils.getImageUrl(metadataUrl),
    ]);

    // store nft to our own database
    const tokenId = await cfxUtils.actualTokenId(address, metadataUrl);
    if (tokenId == -1) {
        // TODO Burn the NFT since failed. Should retry.
        return res.status(500).send();
    }
    const nftId = process.env.MINTER_ADDRESS + "-" + tokenId;
    const params = {
        title: req.body.title,
        nft_id: nftId,
        description: req.body.description,
        file: imageUrl,
        file_hash: fileHash,
        status: constants.STATUS_PRIVATE,
        author: address,
        owner: [{ address: address, percentage: 1 }],
        labels: JSON.parse(req.body.labels),
    };
    const newNft = new Nft(params);
    const user = await User.findOne({ address: address });
    user.nft_ids.push({ address: nftId, percentage: 1 });

    await mongodbUtils
        .saveAll([newNft, user])
        .then(() => {
            return res.send("File uploaded successfully");
        })
        .catch((error) => {
            return res.status(422).json({ error: error.message });
        });
}

// return estimated gas to mint a hard code item from manager address
async function getMintEstimate(req, res) {
    try {
        const uri = "https://ipfs.io/ipfs/00000000000000000000000000000000000000000000000000000000000";
        const cost = await cfxUtils.mintEstimate(process.env.MANAGER_ADDRESS, uri);
        return res.json({ gas: cost.toString() });
    } catch (error) {
        return res.status(500).send(error);
    }
}

// list NFT to change status to sale
async function listNft(req, res) {
    const nftId = req.body.nft_id;
    const nft = await Nft.findOne({ nft_id: nftId });
    // if this nft has more owners, then it's fragmented
    await Nft.findOneAndUpdate({ nft_id: nftId }, { status: constants.STATUS_SALE });

    Nft.findOneAndUpdate(
        { nft_id: nftId },
        {
            status: constants.STATUS_SALE,
            price: req.body.price,
            currency: req.body.currency,
            fractional: req.body.fractional,
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
    const nft = await Nft.findOne({ nft_id: nftId });

    Nft.findOneAndUpdate({ nft_id: nftId }, { status: constants.STATUS_PRIVATE }, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.send("Status changed to pivate");
    });
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

// transferOwnership according to transferOwnership, {recordTransaction} is true by default
async function transferOwnership(txnData, recordTransaction = true) {
    // get buyer/seller
    let buyer = await User.findOne({ address: txnData.buyer });
    let seller = await User.findOne({ address: txnData.seller });

    if (!buyer || !seller) {
        throw new Error("user not found");
    }

    let collectionType = "";
    // TODO: if type not match, throw error
    if (txnData.transaction_type === "purchase-nft") {
        collectionType = "nft";
    }

    // add collection to buyer if collection not already exist
    if (buyer[`${collectionType}_ids`].every((c) => c.address !== txnData.collection_id)) {
        buyer[`${collectionType}_ids`].push({ address: txnData.collection_id, percentage: 1 });
    }
    // remove collection from seller if exist
    const index = seller[`${collectionType}_ids`].findIndex((c) => c.address === txnData.collection_id);
    if (index !== -1) {
        seller[`${collectionType}_ids`].splice(index, 1);
    }

    // get collection and update collection's owner
    let collection = null;
    // TODO: if type not match, throw error
    if (txnData.transaction_type === "purchase-nft") {
        collection = await Nft.findOne({
            nft_id: txnData.collection_id,
        });
        collection.owner = [{ address: txnData.buyer, percentage: 1 }];
    }

    // update collection's status
    collection.status = constants.STATUS_PRIVATE;

    // save document changes
    let documents = [collection, buyer, seller];
    if (recordTransaction) {
        const transaction = new Transaction(txnData);
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
    let txnData = {
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
        transferOwnership(txnData);
    } catch (error) {
        return res.status(404).send(error);
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
    updateViews,
    getMintEstimate,
    likeNft,
    unlikeNft,
};
