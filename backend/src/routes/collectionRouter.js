const express = require("express");
const collectionController = require("../controllers/collectionController");
const multipart = require("connect-multiparty");

const multipartMiddleware = multipart();
const router = express.Router();

router.get("/nft/:nft_id", collectionController.getNft);
router.get("/album/:album_id", collectionController.getAlbum);
router.get("/draw/:draw_id", collectionController.getDraw);
router.get("/fragments", collectionController.getFragments);
router.post("/market", collectionController.getMarket);

router.post("/create-nft", multipartMiddleware, collectionController.createNft);
router.post("/list-nft", collectionController.listNft);
router.post("/delist-nft", collectionController.delistNft);
router.post("/list-nft-draw", collectionController.listNftDraw);
router.post("/create-album", multipartMiddleware, collectionController.createAlbum);
router.post("/list-album", collectionController.listAlbum);
router.post("/delist-album", collectionController.delistAlbum);

router.post("/purchase-nft", collectionController.purchaseNft);
router.post("/draw-nft", collectionController.drawNft);
router.post("/fund-nft", collectionController.fundNft);

router.post("/purchase-album", collectionController.purchaseAlbum);
router.post("/purchase-fragment", collectionController.purchaseFragment);

module.exports = router;
