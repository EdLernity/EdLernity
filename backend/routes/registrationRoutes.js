const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');
const userController = require('../controllers/userController');

const jwtMiddleware = require('../middleware/jwtMiddleware');


//register User
router.post('/register', registrationController.registerUser);
router.post('/login', registrationController.loginUser);

//forget Password
router.post('/send-otp', registrationController.sendOTP);
router.post('/reset-password', registrationController.resetPassword);
router.post('/verify-token', registrationController.verifyUserAndToken);
router.post('/update-password', registrationController.updatePasswordAfterValidate);


//user Details
router.get('/user-details', jwtMiddleware, userController.getUserDetails);

//logout
router.post('/logout', registrationController.logoutUser);


module.exports = router;