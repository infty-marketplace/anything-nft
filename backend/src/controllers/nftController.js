const Nft = require("../models/nft");

const Transaction = require("../models/transaction");
const User = require("../models/user");
const nftStatus = require("../constants/nftStatus");
const transactionType = require("../constants/transactionType");
const imageUtils = require("../utils/imageUtils");
const mongodbUtils = require("../utils/mongodbUtils");
const nftStorageUtils = require("../utils/nftStorageUtils");
const cfxUtils = require("../utils/cfxUtils");

// return a list of on sale NFT's id from cursor position, limit amount
const getMarket = async (req, res) => {
    const body = req.body;

    // build find query
    let findQuery = {"status": nftStatus.SALE} //only display sale status

    switch (body.filtermode) {
      case "filter":
        if (body.selectedCategory.length!==0) {
          findQuery["labels"] = {};
          findQuery["labels"]["$in"] = body.selectedCategory;
        }
        // if filter on search, keep search result
        if (body.text != "") {
            findQuery["title"] = new RegExp(body.text);
        }
        // apply price filter according to user selection
        if (body.price_from && body.price_to) {
            findQuery["price"] = {$gte: Number(body.price_from), $lte: Number(body.price_to)};
        } else if(body.price_from) {
            findQuery["price"] = {$gte: Number(body.price_from)};
        } else if(body.price_to) {
            findQuery["price"] = {$lte: Number(body.price_to)};
        }
        break;
      case "searchText":
        findQuery = { "status": nftStatus.SALE, "title": new RegExp(body.text) };
        break;
    }

    console.log(body.text)

    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }
    console.log(findQuery);
    const limit = body.limit || 10;
    const offset = body.offset || 0;

    const nftQuery = Nft.find(findQuery, { nft_id: 1 })
        .sort({ "createdAt": -1, "nft_id": -1 })
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
    if (nft) {
        await Nft.findOneAndUpdate({ nft_id: nftId }, { views: nft.views + 1 });
        res.send({ views: nft.views + 1 });
    }
    res.status(404).send();
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
        metadata: metadataUrl,
        file_hash: fileHash,
        status: nftStatus.PRIVATE,
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

async function deleteNft(req, res) {
    const { code, message } = await _deleteNft(req.body.nft_id);
    return res.status(code).send(message);
}

async function _deleteNft(nftId) {
    const nft = await Nft.findOne({ nft_id: nftId });
    if (!nft) {
        return { code: 404, message: "nft not found" };
    }

    // delete nft from all owners
    const users = [];
    for (let owner of nft.owner) {
        const user = await User.findOne({ address: owner.address });
        user.nft_ids = user.nft_ids.filter((nft_id) => nft_id.address !== nft.nft_id);
        users.push(user);
    }

    // delete nft from all likers
    for (let likedUser of nft.liked_users) {
        const user = await User.findOne({ address: likedUser });
        user.liked_nfts = user.liked_nfts.filter((nft_id) => nft_id !== nft.nft_id);
        users.push(user);
    }

    try {
        await mongodbUtils.saveAll(users);
    } catch (error) {
        return { code: 422, message: error.message };
    }

    // delete nft
    try {
        // delete from database
        await Nft.deleteOne({ nft_id: nftId });
        // delete image from nft storage iff db is updated
        if (nft.metadata) {
            await nftStorageUtils.burn(nft.metadata);
        }
        // burn nft on chain iff db is updated
        const tokenId = nft.nft_id.split("-")[1];
        await cfxUtils.burn(tokenId);
        return { code: 200, message: "nft deleted successfully" };
    } catch (error) {
        return { code: 422, message: error.message };
    }
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
    await Nft.findOneAndUpdate({ nft_id: nftId }, { status: nftStatus.SALE });

    Nft.findOneAndUpdate(
        { nft_id: nftId },
        {
            status: nftStatus.SALE,
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

    Nft.findOneAndUpdate({ nft_id: nftId }, { status: nftStatus.PRIVATE }, (err) => {
        if (err) {
            return res.status(400).send(err);
        }
        return res.send("Status changed to pivate");
    });
}

// return a list of owners given nft and an optional boolean parameter {addressOnly}
function getNftOwner(nft, addressOnly = true) {
    const owner = nft.owner.find((o) => o.percentage === 1);
    if (addressOnly) {
        return owner.address;
    }
    return owner;
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
    if (txnData.transaction_type === transactionType.PURCHASE_NFT) {
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
    if (txnData.transaction_type === transactionType.PURCHASE_NFT) {
        collection = await Nft.findOne({
            nft_id: txnData.collection_id,
        });
        collection.owner = [{ address: txnData.buyer, percentage: 1 }];
    }

    // update collection's status
    collection.status = nftStatus.PRIVATE;

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

async function validateNftOwnership(req, res) {
    const nftId = req.body.nft_id;
    let nft = await Nft.findOne({ nft_id: nftId });

    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    const tokenID = nftId.split("-")[1];
    if (getNftOwner(nft) !== (await cfxUtils.getOwnerOnChain(tokenID))) {
        // delete this nft from database\
        const { code, message } = await _deleteNft(nftId);
        return res.status(410).json({ error: "the seller is not the current owner of the nft" });
    }

    return res.status(200).send();
}

// purchase nft by specifying nft_id in request body
async function purchaseNft(req, res) {
    const body = req.body;
    let nft = await Nft.findOne({ nft_id: body.nft_id });

    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    if (nft.status !== nftStatus.SALE) {
        return res.status(400).json({ error: "ntf is not for sale" });
    }
    if (getNftOwner(nft) === body.buyer) {
        return res.status(400).json({ error: "buyer is the owner" });
    }
    const tokenID = body.nft_id.split("-")[1];
    await cfxUtils.transferOwnershipOnChain(nft.owner[0].address, body.buyer, tokenID);

    // create a transaction record
    let txnData = {
        buyer: body.buyer,
        seller: nft.owner[0].address,
        transaction_type: transactionType.PURCHASE_NFT,
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
    deleteNft,
    listNft,
    delistNft,
    purchaseNft,
    updateViews,
    getMintEstimate,
    likeNft,
    unlikeNft,
    validateNftOwnership,
};
