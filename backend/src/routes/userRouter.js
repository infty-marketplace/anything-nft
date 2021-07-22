const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/auth", userController.authUser);
router.get("/profile/:address", userController.getUser);

module.exports = router;
