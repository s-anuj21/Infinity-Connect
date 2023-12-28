const express = require("express");

const { protect } = require("../middlewares/authMiddleware");

const {
  registerUser,
  loginUser,
  getAllUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/").get(protect, getAllUser);

module.exports = router;
