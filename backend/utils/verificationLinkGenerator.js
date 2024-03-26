const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const Token = require("../models/webAuthToken");
// const { User } = require("../models/users.models.js"); // Import your User model here
require('dotenv').config();
// Secret key used for signing the JWT token


// Function to generate a verification link using JWT
async function constructVerificationLink(baseURL, email, linkType) {
  // Payload containing the email and expiration time (1 hour)
  const payload = {
    email: email,
    exp: linkType===1?Math.floor(Date.now() / 1000) + 60 * 60:Math.floor(Date.now() / 1000) + 60 * 60, // Expiration time: 1 hour
  };

  // Generate the JWT token with the payload and sign it with the secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  const tokenObj=new Token({
    token: token,
    tokenType:linkType===1?"Create Account":"Password Reset"
  });
  await tokenObj.save();
  // Construct the verification link with the token
  return `${baseURL}/${linkType === 1 ? "verify-email" : "auth/updatePassword"}?token=${token}`;
}

// Function to verify the token and update user's verification status
async function verifyRegisterEmail(token, action) {
  try {
    if (!token) {
      return;
    }
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract user email from the decoded payload
    const userEmail = decoded.email;
    if (!userEmail) {
      return 3;
    }
    if (action == "verifyEmail") {
      // Find the user by email and update the verification status
      await UserModel.findOneAndUpdate(
        { email: userEmail }, // Search criteria
        { isVerified: true }, // Update: set isVerified to true
        { new: true } // Options: return the updated user document
      );
      return 1;
    }
    if (action == "resetPassword") {
      // Find the user by email and update the verification status
      await UserModel.findOneAndUpdate(
        { email: userEmail }, // Search criteria
        { isVerified: true }, // Update: set isVerified to true
        { new: true } // Options: return the updated user document
      );
      return 2;
    }
  } catch (err) {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return 3;
      }
    }
    // If token verification fails, throw an error
  }
}


module.exports = { constructVerificationLink, verifyRegisterEmail };
