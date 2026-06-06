const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registrationController');
const userController = require('../controllers/userController');

const jwtMiddleware = require('../middleware/jwtMiddleware');
const authMiddleware = require('../middleware/authMiddleware');


//register User
router.post('/register', registrationController.registerUser);
router.post('/login', registrationController.loginUser);

//forget Password
router.post('/send-otp', registrationController.sendOTP);
router.post('/reset-password', registrationController.resetPassword);
router.post('/verify-token', registrationController.verifyUserAndToken);
router.post('/update-password', registrationController.updatePasswordAfterValidate);
router.route("/re-verifyEmail").post(registrationController.reVerifyEmail);

//user Details
router.get('/user-details', authMiddleware, userController.getUserDetails);

//logout
router.post('/logout', registrationController.logoutUser);


module.exports = router;