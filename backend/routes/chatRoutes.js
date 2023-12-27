const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").post(accessChat);
router.route("/").get(fetchChats);
router.route("/group").post(createGroup);
router.route("/rename").put(renameGroup);
router.route("/addToGroup").put(addToGroup);
router.route("/removeFromGroup").put(removeFromGroup);

module.exports = router;
