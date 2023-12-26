const express = require("express");
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, getAllMessages);

module.exports = router;
