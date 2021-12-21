const express = require("express");
const albumController = require("../controllers/albumController");
const multipart = require("connect-multiparty");

const multipartMiddleware = multipart();
const router = express.Router();

router.get("/album/:album_id", albumController.getAlbum);
router.post("/create-album", multipartMiddleware, albumController.createAlbum);
router.post("/list-album", albumController.listAlbum);
router.post("/delist-album", albumController.delistAlbum);
router.post("/purchase-album", albumController.purchaseAlbum);

module.exports = router;