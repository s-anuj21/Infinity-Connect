const express = require("express");

const {
  registerUser,
  loginUser,
  getAllUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").get(getAllUser);
router.route("/").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
