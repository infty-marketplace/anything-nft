const express = require("express");
const userController = require("../controllers/userController");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const router = express.Router();

router.post("/auth", userController.authUser);
router.get("/profile/:address", userController.getUser);
router.post("/profile/update-profile", userController.updateProfile);
router.post("/profile/update-avatar", multipartMiddleware, userController.updateAvatar);
router.get("/transaction/:address", userController.getTransactions);

module.exports = router;
