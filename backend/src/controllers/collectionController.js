const Nft = require("../models/nft");
const Album = require("../models/album");
const Draw = require("../models/draw");
const constants = require("../constants/index");
const fs = require("fs");
const { makeid } = require("../utils/helpers");
const s3 = require("../database/s3");

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

module.exports = { createNft, listNft, listNftDraw, createAlbum, listAlbum };
