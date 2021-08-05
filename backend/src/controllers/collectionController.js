const Nft = require("../models/nft");
const Album = require("../models/album");
const Draw = require("../models/draw");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const constants = require("../constants");
const fs = require("fs");
const { makeid } = require("../utils/helpers");
const s3 = require("../database/s3");

const getNft = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const nft = await Nft.findOne(body.nft_id);
    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    res.send(nft);
};

const getAlbum = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const album = await Album.findOne(body.album_id);
    if (!album) {
        return res.status(404).json({ error: "album not found" });
    }
    res.send(album);
};

const getDraw = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const draw = await Draw.findOne(body.draw_id);
    if (!draw) {
        return res.status(404).json({ error: "draw not found" });
    }
    res.send(draw);
};

// return a list of on sale NFT's id from cursor position, limit amount
const getMarket = async (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    const limit = body.limit;
    const offset = body.offset;

    const nftQuery = Nft.find({ status: constants.STATUS_SALE });
    const albumQuery = Album.find({ status: constants.STATUS_SALE });
    nftQuery.sort({ updatedAt: "desc" }).skip(offset);
    albumQuery.sort({ updatedAt: "desc" }).skip(offset);

    if (limit) {
        nftQuery.limit(limit + 1);
        albumQuery.limit(limit + 1);
    }

    let nftIds = [];
    nftQuery.exec((error, doc) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        nftIds.push(doc);
    });

    let albumIds = [];
    albumQuery.exec((error, doc) => {
        if (error) {
            res.status(500).json(error);
            return;
        }
        albumIds.push(doc);
    });

    res.send({ nft_ids: nftIds, album_ids: albumIds });
};

function createNft(req, res, next) {
    console.log("Create NFT");
    const nftId = makeid(5);
    const params = {
        title: req.body.title,
        nft_id: nftId,
        description: req.body.description,
        file: null,

        status: constants.STATUS_PRIVATE,

        owner: [{ address: req.body.address, percentage: 100 }],
    };

    const tmp_path = req.files.file.path;
    const fileToUpload = fs.createReadStream(tmp_path);
    const s3UploadParams = { Bucket: process.env.S3_BUCKET_NAME, Key: nftId, Body: fileToUpload };

    s3.upload(s3UploadParams, function (err, data) {
        if (err) {
            throw err;
        }
        const uploadedUrl = data.Location;
        params.file = uploadedUrl;
        const newNFT = new Nft(params);
        newNFT.save(function (err) {
            if (err) {
                return res.status(400).send(err);
            }
            return res.send("File uploaded successfully");
        });
    });
}

function listNft(req, res, next) {
    const nftId = req.body.nftId;
    await Nft.findOneAndUpdate(
        { nft_id: nftId },
        { status: constants.STATUS_SALE, price: req.body.price, currency: req.body.currency },
        (err) => {
            if (err) {
                return res.status(400).send(err);
            }
            return res.send("Status changed to sale");
        }
    );
}

function listNftDraw(req, res, next) {
    const nftId = req.body.nftId;

    // create draw document
    const drawParams = {
        title: req.body.title,
        draw_id: makeid(5),
        description: req.body.description,

        unit_price: req.body.unitPrice,
        quantity: req.body.quantity,
        currency: req.body.currency,
        deadline: req.body.deadline,

        nft_id: req.body.nftId,
        owner: req.body.owner,
        participants: [],
    };

    const newDraw = new Draw(drawParams);
    newDraw.save(function (err) {
        if (err) {
            return res.status(400).send(err);
        }
        Nft.findOneAndUpdate({ nft_id: nftId }, { status: constants.STATUS_DRAW }, function (err1) {
            if (err1) {
                return res.status(500).send(err1);
            }
            return res.send("Draw document created and status changed to draw");
        });
    });
}

function createAlbum(req, res, next) {
    const params = {
        title: req.body.title,
        album_id: req.body.albumId,
        description: req.body.description,
        file: req.body.file,
        status: req.body.status,

        price: req.body.price,
        currency: req.body.currency,

        nft_ids: req.body.nftIds,
        owner: req.body.userId,
    };
    const newAlbum = new Album(params);
    newAlbum.save(function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send("Album created");
    });
}

function listAlbum(req, res, next) {
    const albumId = req.body.albumId;
    Album.findOneAndUpdate({ album_id: albumId }, { status: constants.STATUS_SALE }, function (err) {
        if (err) {
            return res.send(err);
        }
        return res.send("Album status changed to sale");
    });
}

function save(doc) {
    return new Promise((resolve, reject) => {
        doc.save((err, saved) => {
            if (err) {
                reject(err);
            }
            resolve(saved);
        });
    });
}

async function saveAll(schedules) {
    const promises = schedules.map((schedule) => save(schedule));
    return Promise.all(promises)
        .then((responses) => {
            return;
        })
        .catch((error) => {
            throw error;
        });
}

async function getAlbumNfts(album) {
    let nfts = [];
    for (const id of album.nft_ids) {
        const nft = await Nft.findOne({ nft_id: id });
        nfts.push(nft);
    }
    return nfts;
}

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

function getNftListFunders(nfts, addressOnly = true, unique = true) {
    let funders = [];
    for (const nft of nfts) {
        funders = [...funders, ...getNftFunders(nft, addressOnly)];
    }
    if (unique) {
        return [...new Set(funders)];
    }
    return funders;
}

function isNftFunded(nft) {
    return getNftFunders(nft).length > 0 && getNftOwners(nft).length === 0;
}

async function isAlbumFunded(album) {
    const nfts = await getAlbumNfts(album);
    for (const nft of nfts) {
        if (isNftFunded(nft)) {
            return true;
        }
    }
    return false;
}

async function transferOwnership(transactionDetails, recordTransaction = true) {
    // get buyer/seller
    let buyer = await User.findOne({ address: transactionDetails.buyer });
    let seller = await User.findOne({ address: transactionDetails.seller });

    if (!buyer || !seller) {
        return res.status(404).json({ error: "user not found" });
    }

    let collectionType = "";
    if (transactionDetails.transaction_type === "purchase-album") {
        collectionType = "album";
    } else if (
        transactionDetails.transaction_type === "purchase-nft" ||
        transactionDetails.transaction_type === "fund-nft"
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
        collection = await Album.findOne({ album_id: transactionDetails.collection_id });
        collection.owner = transactionDetails.buyer;
    } else if (transactionDetails.transaction_type === "purchase-nft") {
        collection = await Nft.findOne({ nft_id: transactionDetails.collection_id });
        collection.owner = [{ address: transactionDetails.buyer, percentage: 1 }];
    } else if (transactionDetails.transaction_type === "fund-nft") {
        collection = await Nft.findOne({ nft_id: transactionDetails.collection_id });
        const index = [...getNftOwners(collection), ...getNftFunders(collection)].indexOf(transactionDetails.buyer);
        if (index >= 0) {
            collection.owner[index].percentage += transactionDetails.percentage;
        } else {
            collection.owner.push({ address: transactionDetails.buyer, percentage: transactionDetails.percentage });
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
    await saveAll(documents)
        .then(() => {
            return;
        })
        .catch((error) => {
            throw error;
        });
}

async function purchaseNtf(req, res) {
    const body = req.body;
    let nft = await Nft.findOne({ nft_id: body.nft_id });

    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    if (nft.status !== constants.STATUS_SALE) {
        return res.status(400).json({ error: "ntf is not for sale" });
    }

    if (isNftFunded(nft)) {
        return res.status(400).json({ error: "nft is completely funded" });
    }
    if (getNftOwners(nft).includes(body.buyer)) {
        return res.status(400).json({ error: "buyer is the owner" });
    }

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
    await transferOwnership(transactionDetails);

    //check if this nft fullfills a album
    if (nft.album_id && nft.album_id !== "") {
        let album = await Album.findOne({ album_id: nft.album_id });
        // if every nft is not completely funded and every nft's owner is the same
        const nfts = await getAlbumNfts(album);
        if (!(await isAlbumFunded(album)) && getNftListOwners(nfts).length === 1) {
            const albumTransactionDetails = {
                buyer: body.buyer,
                seller: album.owner,
                transaction_type: "purchase-album",
                collection_id: album.album_id,
            };
            await transferOwnership(albumTransactionDetails, false);
        }
    }
    return res.status(200).send();
}

async function fundNtf(req, res) {
    const body = req.body;

    let nft = await Nft.findOne({ nft_id: body.nft_id });
    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    if (nft.status !== constants.STATUS_SALE) {
        return res.status(400).json({ error: "ntf is not for sale" });
    }
    // owner[0] is the original seller, owner[1:] are the funder
    let sellers = getNftOwners(nft, false);
    let funders = getNftFunders(nft, false);

    // added new funder to funders
    const index = funders.map((funder) => funder.address).indexOf(body.buyer);
    if (index >= 0) {
        funders[index].percentage += body.percentage;
    } else {
        funders.push({ address: body.buyer, percentage: body.percentage });
    }

    // if no sellers, then the nft is already funded
    if (sellers.length === 0) {
        return res.status(400).json({ error: "nft is already funded" });
    }
    if (sellers.map((seller) => seller.address).includes(body.buyer)) {
        return res.status(400).json({ error: "funder is the owner" });
    }
    const fundedPercentages = funders.reduce((pv, cv) => pv + cv.percentage, 0);
    if (fundedPercentages > 1) {
        return res.status(400).json({ error: "exceed maximum percentage" });
    }

    // create a transaction record
    let transactionDetails = {
        buyer: body.buyer,
        seller: sellers[0].address,
        transaction_type: "fund-nft",
        price: nft.price,
        currency: nft.currency,
        collection_id: nft.nft_id,
        percentage: body.percentage,
    };

    nft.owner = fundedPercentages === 1 ? [] : [...sellers, ...funders];
    await saveAll([nft]);

    // if nft is fully funded, remove seller, trsander ownership to funders
    if (fundedPercentages === 1) {
        for (const funder of funders) {
            let nftTransactionDetails = {
                buyer: funder.address,
                seller: transactionDetails.seller,
                transaction_type: transactionDetails.transaction_type,
                collection_id: transactionDetails.collection_id,
                percentage: funder.percentage,
            };
            await transferOwnership(nftTransactionDetails, false);
        }
    }
    await saveAll([new Transaction(transactionDetails)])
        .then(() => {
            return res.status(200).send();
        })
        .catch((error) => {
            return res.status(422).json({ error: error.message });
        });
}

async function drawNft(req, res) {
    const body = req.body;
    let draw = await Draw.findOne({ draw_id: body.draw_id });
    if (!draw) {
        return res.status(404).json({ error: "draw not found" });
    }
    const nft = await Nft.findOne({ nft_id: draw.nft_id });
    if (!nft) {
        return res.status(404).json({ error: "nft not found" });
    }
    if (nft.status != constants.STATUS_DRAW) {
        return res.status(400).json({ error: "nft is not for draw" });
    }
    if (isNftFunded(nft)) {
        return res.status(400).json({ error: "nft is completely funded" });
    }
    if (getNftOwners(nft).includes(body.buyer)) {
        return res.status(400).json({ error: "participant is the owner" });
    }

    let transactionDetails = {
        buyer: body.buyer,
        seller: getNftOwners(nft)[0],
        transaction_type: "draw-nft",
        price: draw.unit_price,
        quantity: body.quantity,
        currency: draw.currency,
        commission: body.commission,
        commission_currency: body.commission_currency,
        collection_id: draw.draw_id,
    };

    const index = draw.participants.map((e) => e.address).indexOf(transactionDetails.buyer);
    if (index >= 0) {
        draw.participants[index].quantity += transactionDetails.quantity;
    } else {
        draw.participants.push({ address: transactionDetails.buyer, quantity: transactionDetails.quantity });
    }

    // TODO: transfer upon deadline/all drawed
    await saveAll([draw, new Transaction(transactionDetails)])
        .then(() => {
            return res.status(200).send();
        })
        .catch((error) => {
            return res.status(422).json({ error: error.message });
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

    // check if any associated nft is funded or if any associated nft is not owned by album owner
    if (await isAlbumFunded(album)) {
        return res.status(400).json({ error: "album contains funded nft" });
    }

    // create a transaction record
    const transactionDetails = {
        buyer: body.buyer,
        seller: album.owner,
        transaction_type: "purchase-album",
        price: album.price,
        currency: album.currency,
        commission: body.commission,
        commission_currency: body.commission_currency,
        collection_id: album.album_id,
    };
    await transferOwnership(transactionDetails);

    //update associated nft's information
    const nfts = await getAlbumNfts(album);
    for (const nft of nfts) {
        const nftTransactionDetails = {
            buyer: body.buyer,
            seller: album.owner,
            transaction_type: "purchase-nft",
            collection_id: nft.nft_id,
        };
        await transferOwnership(nftTransactionDetails, false);
    }

    return res.status(200).send();
}

module.exports = {
    getNft,
    getAlbum,
    getDraw,
    getMarket,
    createNft,
    listNft,
    listNftDraw,
    createAlbum,
    listAlbum,
    purchaseNtf,
    purchaseAlbum,
    drawNft,
    fundNtf,
};
