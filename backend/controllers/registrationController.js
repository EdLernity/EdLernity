require("dotenv").config(); // Load environment variables from .env
const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyEmail } = require("../utils/emailVerifier");
const nodemailerUtils = require("../utils/nodemailerUtils");
const moment = require("moment");
const Yup = require("yup");
const { sendEmail } = require("../utils/sendEmail");
const { accountVerification } = require("../templates/registerMailTemplate");
const emailVerificationTemplate = require("../templates/registerMailTemplate");
const { constructVerificationLink, verifyRegisterEmail } = require("../utils/verificationLinkGenerator");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/ApiReqRes");
const UserModel = require("../models/userModel");
const resetPasswordMailTemplate = require("../templates/resetPasswordMailTemplate");
const Token = require("../models/webAuthToken");



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
    const { firstName, lastName, email, phone, password, confirmPassword, googleSignUp } = req.body;

    const requiredFields = googleSignUp ? ['firstName', 'email'] : ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];

    // Check for missing required fields
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if passwords match (only if not Google sign-up)
    if (!googleSignUp && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }
    const userId = await generateUserId();

    // Check if the email already exists
    const existingUserByEmail = await userModel.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ success: false, message: "Email already exists.", redirectTo: "/auth/signup", text: "to sign up again." });
    }

    if (!googleSignUp) {
      // Check if phone number already exists
      const existingUserByPhone = await userModel.findOne({ phone });
      if (existingUserByPhone) {
        return res.status(400).json({ success: false, message: "Phone number already exists with a different account.", redirectTo: "/auth/signup", text: "to sign up again." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a unique numeric user ID

      const newUser = new userModel({
        userId,
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        isGoogleAuth: false,
        isVerified: false
      });
      await newUser.save();
      //send mail
      const verificationLink = await constructVerificationLink(
        process.env.APPLICATION_URL,
        email,
        1
      );
      console.log(verificationLink)

      const htmlTemplate = emailVerificationTemplate(verificationLink, firstName);
      sendEmail("Verify your mail - EdLernity", email, htmlTemplate, htmlTemplate).then((result) => {
        //console.log(result)
      }).catch((error) => {
        //console.log("err", err)
      })
      return res.json({ success: true, message: `Thank you for registering with edlernity. We’ve sent you a verification link to the email address <span class="font-medium text-indigo-500">${email}</span>.`, redirectTo: "/", text: "" });


    } else {
        // Generate a unique numeric user ID
      const newUser = new userModel({
        userId,
        firstName,
        lastName,
        email,
        isGoogleAuth: true,
        isVerified: true
      });
      await newUser.save();
      return res.json({ success: true, message: "Thank you for registering with edlernity.", redirectTo: "/", text: "" });

    }


  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Error registering user", redirectTo: "/auth/signup", text: "to sign up again." });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password, googleSignUp } = req.body;

    // Check if email and password are provided
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email required", redirectTo: "/auth/login", text: "to login again." });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });


    // Check if the user exists
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email is not registered", redirectTo: "/auth/login", text: "to login again." });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ success: false, message: "Account not verified!", redirectTo: "/reverify-email", text: "to verify again." });
    }
if(password&&user.isGoogleAuth)
{
  return res
  .status(401)
  .json({ success: false, message: "Please Login with Google", redirectTo: "/auth/login", text: "to login again." }); 
}
    // Check if the password matches
    if (!googleSignUp) {
      console.log(password, user.password)
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password", redirectTo: "/auth/login", text: "to login again." });
      }
      const token = jwt.sign(
        { userId: user._id, email: user.email, userTemp: user.userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Send the token in the response
      return res.json({ success: true, token, redirectTo: "/", text: "", token });
    } else if (googleSignUp) {
      // If email and password are valid, generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, userTemp: user.userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Send the token in the response
      return res.json({ success: true, token, redirectTo: "/", text: "", token });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", redirectTo: "/auth/login", text: "to login again." });
  }
};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is null or empty
    if (!email) {
      return res.json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // Check if the email exists in the UserModel
    const userExists = await userModel.findOne({ email });

    // If the user doesn't exist, return an error
    if (!userExists) {
      return res.json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    // Generate new OTP
    const verificationCode = nodemailerUtils.generateVerificationCode();

    // Save the verification code (overwrite existing if any)
    const result = await otpModel.findOneAndUpdate(
      { email },
      { code: verificationCode },
      { upsert: true, new: true } // Use { new: true } to return the updated document
    );

    // Send OTP to the email
    nodemailerUtils.sendVerificationCodeEmail(email, verificationCode);

    if (result) {
      return res.json({ success: true, message: "OTP sent successfully" });
    } else {
      return res.json({ success: false, message: "Error sending OTP" });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.json({ success: false, message: "Error sending OTP" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user with the provided email exists
    const user = await userModel.findOne({ email });



    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "Email is not registered.", redirectTo: "/auth/reset", text: "to reset again." });
    }

    const verificationLink = await constructVerificationLink(
      process.env.APPLICATION_URL,
      user.email,
      2
    );

    const htmlTemplate = resetPasswordMailTemplate(verificationLink, user.firstName);
    sendEmail("Reset your password - EdLernity", user.email, htmlTemplate, htmlTemplate).then((result) => {

    }).catch((error) => {
      //console.log("err", err)
    })

    sendSuccessResponse(
      res,
      200,
      null,
      `Password reset link sent to your email: <span class="font-medium text-indigo-500">${email}</span>`
    );
  } catch (e) {
    //console.log(e)
    return res.status(400).json({
      sucess: false, message: "Error resetting password.",
      redirectTo: "/auth/reset",
      text: "to reset again."
    });
  }
};

const verifyUserAndToken = async (req, res) => {

  try {
    const { token, action } = req.body;
    if (!(token || action)) {
      return sendErrorResponse(res, 401, "Please provide required parameter");
    } else {
      const status = await verifyRegisterEmail(token, action);

      if (status === 1) {
        sendSuccessResponse(res, 200, "", "Account verified successfully");
      } else if (status === 2) {
        sendSuccessResponse(res, 200, true, "");
      } else if (status === 3) {
        return sendErrorResponse(
          res,
          401,
          "Link Expired! Please verify yourself."
        );
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
// Function for updating password after validating the token
const updatePasswordAfterValidate = async (req, res) => {
  const { newPassword, confirmPassword, token } = req.body;

  // Validation of Password & Confirm Password fields
  const createUserSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(8, "Too Short!")
      .required("Please enter a password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Please enter your password again"),
  });

  // If validation fails then it will return each field's error which help in showing individual errors on the frontend
  // If there are validation errors then it will go to catch block
  try {
    createUserSchema.validateSync(req.body);

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const email = payload.email;

    // Finding the User from the database using the 'email' field
    const user = await userModel.findOne({ email });



    try {
      if (email && user) {
        // If no such user found in the database then it will show 'No Such User Found.'
        if (!user) {
          return res.status(400).json({ message: "No Such User Found.", redirectTo: "/auth/reset", text: "to reset again." });
        } else {

          const isTokenExpired = await Token.findOne({ token: token, tokenType: "Password Reset" })
          if (!isTokenExpired) {
            return res.status(500).json({ success: false, message: 'Your link has already used. Please try to generate again.', redirectTo: "/auth/reset", text: "to reset again." });
          }
          // Updating the password of the user with the help of 'updatePassword' function
          const oldPassword = user.password;

          // Compare the old password with the new password
          const isOldPasswordValid = await bcrypt.compare(
            newPassword,
            oldPassword
          );
          if (isOldPasswordValid) {
            // If old password matches new password, return an error
            return res.status(404).json({
              success: false,
              message: "New password should be different from the old password.",
              redirectTo: "/auth/reset",
              text: "to reset again."
            });
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
            return res.status(500).json({
              success: false,
              message: "Error updating password.",
              redirectTo: "/auth/reset", text: "to reset again."
            });
          }


          await Token.findByIdAndDelete(isTokenExpired._id);
          // Send a response to the client
          return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
            redirectTo: "/auth/login",
            text: "to login again."
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Your link has already used. Please try to generate again.', redirectTo: "/auth/reset", text: "to reset again." });
    }
  } catch (error) {
    //console.log(error)
    return res.status(500).json({
      success: false,
      message: `Error resetting password.`,
      redirectTo: "/auth/reset", text: "to reset again."
    });
  }
};
const reVerifyEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendErrorResponse(res, 401, "Please provide email");
  }
  const emailExist = await UserModel.findOne({
    email,
    isVerified: false,
  });

  if (emailExist) {
    const verificationLink = constructVerificationLink(
      process.env.APPLICATION_URL,
      emailExist.email,
      1
    );
    const htmlTemplate = emailVerificationTemplate(verificationLink, emailExist.firstName);
    sendEmail("Verify your mail - EdLernity", emailExist.email, htmlTemplate, htmlTemplate).then((result) => {

    }).catch((error) => {
      //console.log("err", err)
    })

    sendSuccessResponse(
      res,
      200,
      emailExist,
      "Verification link has been sent to your mail. Please verify yourself!"
    );
  } else {
    return sendErrorResponse(
      res,
      404,
      "Account not found or already verified."
    );
  }
};

// function setCookie(res, cookieData) {
//   let token = jwt.sign(JSON.stringify(cookieData), process.env.JWT_SECRET, {
//     expiresIn: "7d",
//   });
//   return res
//     .header("Set-Cookie", `Authorization=${token};HttpOnly;SameSite=Lax`)
//     .json(cookieData);
// }

// function validateRegisterData(data) {
//   const schema = Joi.object().keys({
//     username: Joi.string().alphanum().min(3).max(50).required(),
//     password: Joi.string()
//       .regex(/^[a-zA-Z0-9]{8,}$/)
//       .required(),
//   });

//   return Joi.validate(data, schema);
// }

// function validateLoginData(data) {
//   const schema = Joi.object().keys({
//     username: Joi.string().required(),
//     password: Joi.string().required(),
//   });
//   data.password = CryptoJS.AES.decrypt(
//     data.password,
//     process.env.CRYPTO_KEY
//   ).toString(CryptoJS.enc.Utf8);
//   return Joi.validate(data, schema);
// }
// @route POST api/auth/login
// @desc Login user and return JWT token
// @access Public
// router.post("/login", async (req, res) => {
//   const { error } = validateLoginData(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const user = await findUserByEmailOrUsername(req.body.username, "email");
//   if (!user) return res.status(400).send("Invalid email or username");

//   const validPassord = (await user.isValidPassword(req.body.password)).valid;
//   if (!validPassord) return res.status(400).send("Wrong password");

//   //Jwt sign the user and send back the token
//   const token = user.genToken();
//   res.header("token", token).send(_.omit(user, "password"));
// });

// @route GET api/auth/current
// @desc Return current logged in user
// @access Private
// router.get(
//   "/current",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     res.send(req.user);
//   }
// );

const logoutUser = (req, res) => {
  try {
    // Clear the authentication token (assuming you're using JWT)

    res.clearCookie("token");
    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  sendOTP,
  resetPassword,
  logoutUser,
  verifyUserAndToken,
  updatePasswordAfterValidate,
  reVerifyEmail
};
