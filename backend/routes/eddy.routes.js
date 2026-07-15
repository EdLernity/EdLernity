const express = require("express");
const { chatWithEddy } = require("../controllers/eddyChatController");

const router = express.Router();

router.post("/chat", chatWithEddy);

module.exports = router;
