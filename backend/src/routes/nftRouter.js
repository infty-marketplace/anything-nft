const express = require("express");
const nftController = require("../controllers/nftController");
const multipart = require("connect-multiparty");

const multipartMiddleware = multipart();
const router = express.Router();

router.post("/market", nftController.getMarket);

router.get("/nft/:nft_id", nftController.getNft);
router.post("/create-nft", multipartMiddleware, nftController.createNft);
router.post("/delete-nft", nftController.deleteNft);
router.post("/mint-estimate", nftController.getMintEstimate);
router.post("/list-nft", nftController.listNft);
router.post("/delist-nft", nftController.delistNft);
router.post("/purchase-nft", nftController.purchaseNft);
router.post("/update-views/:nft_id", nftController.updateViews);
router.post("/like-nft", nftController.likeNft);
router.post("/unlike-nft", nftController.unlikeNft);

module.exports = router;
