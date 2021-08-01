const Nft = require("../models/nft");
const Album = require("../models/album");
const Transaction = require("../models/transaction");
const User = require("../models/user");
const Draw = require("../models/draw");
const constants = require("../constants");

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

function getNftOwners(nft) {
    return nft.owner.map((element) => {
        return element.address;
    });
}

async function getAlbumNftsAndOwners(album) {
    let nftOwners = [];
    let nfts = [];
    for (const id of album.nft_ids) {
        const nft = await Nft.findOne({ nft_id: id });
        nfts.push(nft);
        nftOwners = [...nftOwners, ...getNftOwners(nft)];
    }
    // await album.nft_ids.forEach(async (id) => {
    //     const nft = await Nft.findOne({ nft_id: id });
    //     nfts.push(nft);
    //     nftOwners = [...nftOwners, ...getNftOwners(nft)];
    // });
    return { nfts: nfts, nftOwners: nftOwners };
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
        const index = getNftOwners(collection).indexOf(transactionDetails.buyer);
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

    const owners = getNftOwners(nft);
    if (owners.length !== 1) {
        return res.status(400).json({ error: "nft is not owned by a single owner" });
    }
    if (owners.includes(body.buyer)) {
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
        const { nfts, nftOwners } = await getAlbumNftsAndOwners(album);
        const uniqueNftOwners = [...new Set(nftOwners)];
        if (nftOwners.length === album.nft_ids.length && uniqueNftOwners.length === 1) {
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
    let sellers = [];
    let funders = [];
    nft.owner.forEach((element) => {
        if (element.percentage === 1) {
            sellers.push(element);
        } else {
            funders.push(element);
        }
    });

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
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    let draw = await Draw.findOne({ draw_id: body.draw_id });
    if (!draw) {
        return res.status(404).json({ error: "draw not found" });
    }

    let transactionDetails = {
        buyer: body.buyer,
        seller: draw.owner,
        transaction_type: "draw-nft",
        price: draw.unit_prie,
        quantity: body.quantity,
        currency: draw.currency,
        commission: body.commission,
        commission_currency: body.commission_currency,
        collection_id: draw.draw_id,
    };
    draw.participant.push({
        address: transactionDetails.buyer,
        quantity: transactionDetails.quantity,
    });

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
    if (!body) {
        return res.status(400).json({ error: "invalid request" });
    }

    let album = await Album.findOne({ album_id: body.album_id });

    if (!album) {
        return res.status(404).json({ error: "album not found" });
    }
    if (album.status !== constants.STATUS_SALE) {
        return res.status(400).json({ error: "album is not for sale" });
    }
    if (album.owner === body.buyer) {
        return res.status(400).json({ error: "buyer is owner" });
    }

    // check if any associated nft is funded or if any associated nft is not owned by album owner
    const { nfts, nftOwners } = await getAlbumNftsAndOwners(album);
    if (nftOwners.length !== album.nft_ids.length || Set(nftOwners).size !== 1) {
        return res.status(400).json({ error: "album is not owned by a single owner" });
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
    await wnership(transactionDetails);

    //update associated nft's information
    await nfts.forEach(async (nft) => {
        const nftTransactionDetails = {
            buyer: body.buyer,
            seller: album.owner,
            transaction_type: "purchase-nft",
            collection_id: nft.nft_id,
        };
        await transferOwnership(nftTransactionDetails, false);
    });

    return res.status(200).send();
}

module.exports = {
    purchaseNtf,
    purchaseAlbum,
    drawNft,
    fundNtf,
};
