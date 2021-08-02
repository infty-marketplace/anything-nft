const express = require("express");
const collectionController = require("../controllers/collectionController");

const router = express.Router();

router.get("/nft/:nft_id", collectionController.getNft);
router.get("/album/:album_id", collectionController.getAlbum);
router.get("/draw/:draw_id", collectionController.getDraw);
router.post("/market", collectionController.getMarket);

router.post("/create-nft", () => {});
router.post("/list-nft", () => {});
router.post("/list-nft-draw", () => {});

router.post("/create-album", () => {});
router.post("/list-album", () => {});

router.post("/purchase-nft", () => {});
router.post("/draw-nft", () => {});
router.post("/fund-nft", () => {});

router.post("/purchase-album", () => {});

module.exports = router;
