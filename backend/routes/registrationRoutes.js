const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');


//register User
router.post('/register', registrationController.registerUser);
router.post('/login', registrationController.loginUser);

module.exports = router;