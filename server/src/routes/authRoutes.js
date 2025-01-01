const express = require("express");
const { registerUser } = require("../controllers/authController.js");

const router = express.Router();

router.post("/signup", (req, res) => registerUser(req, res));

module.exports = router;
