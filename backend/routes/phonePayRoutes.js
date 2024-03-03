const express = require('express');
const phonePayController = require('../controllers/phonePayController');

const router = express.Router();

// Route for payment
router.post("/payment", phonePayController.payment);

// Route for payment status
router.post('/callback', phonePayController.callback);

module.exports = router;