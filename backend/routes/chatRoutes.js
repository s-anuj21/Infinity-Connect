const express = require("express");
const { accessChat } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(accessChat);

module.exports = router;
