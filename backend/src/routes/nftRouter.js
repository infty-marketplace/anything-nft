const express = require("express");
const nftController = require("../controllers/nftController");
const multipart = require("connect-multiparty");
const rateLimit = require("express-rate-limit");

const multipartMiddleware = multipart({maxFilesSize: 100 * 1024 * 1024}); // limit file size to 100 MB
const createLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    max: 100, // Limit each IP to 100 create NFTs requests per `window`
    message: "Too many NFTs created from this IP, please try again after 24 hours",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const router = express.Router();

router.post("/market", nftController.getMarket);

router.get("/nft/:nft_id", nftController.getNft);
router.post("/create-nft", createLimiter, multipartMiddleware, nftController.createNft);
router.post("/delete-nft", nftController.deleteNft);
router.post("/mint-estimate", nftController.getMintEstimate);
router.post("/list-nft", nftController.listNft);
router.post("/delist-nft", nftController.delistNft);
router.post("/purchase-nft", nftController.purchaseNft);
router.post("/update-views/:nft_id", nftController.updateViews);
router.post("/like-nft", nftController.likeNft);
router.post("/unlike-nft", nftController.unlikeNft);
router.post("/validate-nft", nftController.validateNftOwnership);

module.exports = router;
