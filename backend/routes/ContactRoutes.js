const express = require('express');
const contactController = require('../controllers/contactController');

const router = express.Router();

// Route for contact
router.post("/contact",contactController.createUserContact );

router.post("/getUsers",contactController.getUsersContact );

module.exports = router;