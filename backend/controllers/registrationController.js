require('dotenv').config(); // Load environment variables from .env

const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { verifyEmail } = require('../utils/emailVerifier');
const nodemailerUtils = require('../utils/nodemailerUtils');


const generateUserId = async () => {
    let isUnique = false;
    let userId;

    while (!isUnique) {
        // Generate a unique 8-digit numeric user ID
        userId = Math.floor(10000000 + Math.random() * 90000000);

        // Check if the generated userId already exists in the database
        const existingUser = await userModel.findOne({ userId });

        // If not found, set isUnique to true to break out of the loop
        isUnique = !existingUser;
    }

    return userId;
};

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        // Check if any of the required fields are missing
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        // Verify the email
        const emailVerificationResult = await verifyEmail(email);

        if (!emailVerificationResult.success) {
            return res.status(400).json(emailVerificationResult);
        }


        // Check if the email already exists
        const existingUserByEmail = await userModel.findOne({ email });

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate a unique numeric user ID
        const userId = await generateUserId();

        const newUser = new userModel({
            userId,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.json({ success: true, message: 'Registration successful' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Error registering user' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        // Find the user by email
        const user = await userModel.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email is not registered' });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Incorrect password' });
        }

        // If email and password are valid, generate a JWT token
        const token = jwt.sign({ userId: user.userId, email: user.email },process.env.SECRET_KEY, { expiresIn: '1h' });


        // Send the token in the response
        return res.json({ success: true, token });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is null or empty
        if (!email) {
            return res.json({ success: false, message: 'Please enter a valid email address' });
        }
      
        // Check if the email exists in the UserModel
        const userExists = await userModel.findOne({ email });

        // If the user doesn't exist, return an error
        if (!userExists) {
            return res.json({ success: false, message: 'User with this email does not exist' });
          
        // Generate new OTP
        const verificationCode = nodemailerUtils.generateVerificationCode();

        // Save the verification code (overwrite existing if any)
        const result = await otpModel.findOneAndUpdate(
            { email },
            { code: verificationCode },
            { upsert: true, new: true } // Use { new: true } to return the updated document
        );

        // Send OTP to the email
        nodemailerUtils.sendVerificationEmail(email, verificationCode);

        if (result) {
            return res.json({ success: true, message: 'OTP sent successfully' });
        } else {
            return res.json({ success: false, message: 'Error sending OTP' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.json({ success: false, message: 'Error sending OTP' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Check if the user with the provided email exists
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Email is not registered.' });
        }

        // Check if the email is present in the VerificationModel
        const existingVerificationCode = await otpModel.findOne({ email });

        if (!existingVerificationCode) {
            // If email is not present, return an error
            return res.json({ success: false, message: 'Email is not verified. Please regenerate a new OTP.' });
        }

        // Check if the OTP is correct
        const isVerificationCodeValid = existingVerificationCode.code === otp;

        if (!isVerificationCodeValid) {
            // If verification code is invalid, return an error
            return res.json({ success: false, message: 'Invalid verification code. Please check your email for the correct code.' });
        }

        // Fetch the old password from the userModel
        const oldPassword = user.password;

        // Compare the old password with the new password
        const isOldPasswordValid = await bcrypt.compare(newPassword, oldPassword);

        if (isOldPasswordValid) {
            // If old password matches new password, return an error
            return res.json({ success: false, message: 'New password should be different from the old password.' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the UserModel
        const userUpdate = await userModel.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!userUpdate) {
            return res.json({ success: false, message: 'Error updating password.' });
        }

        // Remove the used verification code from the VerificationModel
        await otpModel.findOneAndDelete({ email });

        return res.json({ success: true, message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ success: false, message: 'Error resetting password.' });
    }
};

const logoutUser = (req, res) => {
    try {
      // Clear the authentication token (assuming you're using JWT)

      res.clearCookie('token');
      return res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  


module.exports = { registerUser, loginUser, sendOTP, resetPassword, logoutUser };
