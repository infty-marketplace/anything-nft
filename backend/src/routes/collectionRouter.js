const express = require("express");
const collectionController = require("../controllers/collectionController");

const router = express.Router();

router.get("/nft/:nft_id", () => {});
router.get("/album/:album_id", () => {});
router.get("/draw/:draw_id", () => {});
router.post("/market", () => {});

router.post("/create-nft", () => {});
router.post("/list-nft", () => {});
router.post("/list-nft-draw", () => {});

router.post("/create-album", () => {});
router.post("/list-album", () => {});

router.post("/purchase-nft", collectionController.purchaseNtf);
router.post("/draw-nft", () => {});
router.post("/fund-nft", () => {});

router.post("/purchase-album", collectionController.purchaseAlbum);

module.exports = router;
