const express = require("express");
const collectionController = require("../controllers/collectionController");
const Nft = require("../models/nft");
const Album = require("../models/album");
const Draw = require("../models/draw");
const constants = require("../constants/index");
const mongoose = require("mongoose");
const multipart = require('connect-multiparty');

const multipartMiddleware = multipart();

mongoose.set('useFindAndModify', false);

const router = express.Router();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: constants.S3_KEY_ID,
    secretAccessKey: constants.S3_KEY_SECRET
});

router.get("/nft/:nft_id", ()=>{});
router.get("/album/:album_id", ()=>{});
router.get("/draw/:draw_id", ()=>{});
router.post("/market", ()=>{});

router.post("/create-nft", multipartMiddleware, (req, res, next)=>{
    const params = {
        title: req.body.title,
        nft_id: req.body.nftId,
        description: req.body.description,
        file: req.body.file,

        status: req.body.status,

        price: req.body.price,
        currency: req.body.currency,

        album_id: req.body.albumId,
        owner: [{'address': req.body.userId, 'percentage': 100}],

        draw_smart_contract_address: req.body.drawContractAddress,
        share_smart_contract_address: req.body.shareContractAddress
    };
    const newNFT = new Nft(params);

    //var s3UploadParams = {Bucket: constants.S3_BUCKET_NAME, Key: '', Body: ''};

    newNFT.save(function (err){
        if (err) {
            return res.send(err);
        }
        return res.send("uploaded");
    });
});

router.post("/list-nft", (req, res, next)=>{
    const nftId = req.body.nftId;
    Nft.findOneAndUpdate({"nft_id" : nftId}, {'status': constants.STATUS_SALE}, function(err){
        if (err){
            return res.send(err);
        }
        return res.send("Status changed to sale");
    });
});
router.post("/list-nft-draw", (req, res, next)=>{
    const nftId = req.body.nftId;

    // create draw document
    const drawParams = {
        title: req.body.title,
        draw_id: req.body.drawId,
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
    newDraw.save(function (err){
        if (err) {
            return res.send(err);
        }
        Nft.findOneAndUpdate({"nft_id" : nftId}, {'status': constants.STATUS_DRAW}, function(err1){
            if (err1){
                return res.send(err1);
            }
            return res.send("Draw document created and status changed to draw");
        });
    });
});

router.post("/create-album", (req, res, next)=>{
    const params = {
        title: req.body.title,
        album_id: req.body.albumId,
        description: req.body.description,
        file: req.body.file,
        status: req.body.status,

        price: req.body.price,
        currency: req.body.currency,
        
        nft_ids: req.body.nftIds,
        owner: req.body.userId
    };
    const newAlbum = new Album(params);
    newAlbum.save(function (err){
        if (err) {
            return res.send(err);
        }
        return res.send("Album created");
    });
});

router.post("/list-album", (req, res, next)=>{
    const albumId = req.body.albumId;
    Album.findOneAndUpdate({"album_id": albumId}, {'status': constants.STATUS_SALE}, function(err){
        if (err){
            return res.send(err);
        }
        return res.send("Album status changed to sale");
    });
});


router.post("/purchase-nft", ()=>{});
router.post("/draw-nft", ()=>{});
router.post("/fund-nft", ()=>{});

router.post("/purchase-album", ()=>{});

module.exports = router;