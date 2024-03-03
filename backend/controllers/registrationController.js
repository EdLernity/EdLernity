require("dotenv").config(); // Load environment variables from .env
const userModel = require("../models/userModel");
const otpModel = require("../models/otpModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyEmail } = require("../utils/emailVerifier");
const nodemailerUtils = require("../utils/nodemailerUtils");
const resetTokenModel = require("../models/resetTokenModel");
const moment = require("moment");
const ResetToken = require("../models/resetTokenModel");
const Yup = require("yup");

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
    const { firstName, lastName, email, phone, password, confirmPassword } = req.body;

    // Check if any of the required fields are missing
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    // Verify the email
    // const emailVerificationResult = await verifyEmail(email);

    // if (!emailVerificationResult.success) {
    //   return res.status(400).json(emailVerificationResult);
    // }

    // Check if the email already exists
    const existingUserByEmail = await userModel.findOne({ email });

    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." , redirectTo: "/auth/signup" , text: "to sign up again." });
    }

    const existingUserByPhone = await userModel.findOne({ phone });

    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone number is already exists with diffrent account." , redirectTo: "/auth/signup" , text: "to sign up again." });
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
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    return res.json({ success: true, message: "Thank you for registering with edlernity. ", redirectTo: "/" ,text : ""});
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error registering user" , redirectTo: "/auth/signup" , text: "to sign up again."});
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" , redirectTo: "/auth/login" , text: "to login again." });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Email is not registered" , redirectTo: "/auth/login" , text: "to login again." });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" , redirectTo: "/auth/login" , text: "to login again." });
    }

    // If email and password are valid, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "50m" }
    );

    // Send the token in the response
    return res.json({ success: true, token , redirectTo: "/" , text : "" , token});
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" , redirectTo: "/auth/login" , text: "to login again." });
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

    await resetTokenModel.deleteMany({ userId:user._id })

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "Email is not registered." , redirectTo: "/auth/reset" , text: "to reset again."});
    }

    const token = jwt.sign(
      { userId: user._id, email: email },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );

    const resetToken = new ResetToken({
      userId: user._id,
      token,
      expires: moment().add(1, "hour").toDate(),
    });

    await resetToken.save();
    let url = `${req.get("origin")}/auth/updatePassword?token=${
      resetToken.token
    }`;

    let subject = "Please reset your password";
    let html = `<h2>Hello ${user.firstName}</h2><p>Your account is almost ready to use.</p> <a href="${url}">Click here</a> to verify your account.<br/> <small>If you didn't make this request just ignore this email.</small><br/>`;

    let isMailSent = nodemailerUtils.sendVerificationEmail(
      email,
      subject,
      html
    );

    if (!isMailSent) {
      return res.json({
        success: false,
        message: "Failed to send  verification email.",
        redirectTo: "/auth/reset" , 
        text: "to reset again."
      });
    }

    return res.json({
      success: true,
      message: `Verification email has been send to your email : ${email}, please check.`,
    });
  } catch (e) {
    return res.status(400).json({ sucess:false, message: "Error resetting password.",
    redirectTo: "/auth/reset" , 
    text: "to reset again." });
  }
};

const verifyUserAndToken = async (req, res) => {
  try {
    const { token } = req.body;

    let decodeToken = jwt.verify(token, process.env.JWT_SECRET);

    const resetToken = await resetTokenModel
      .findOne({
        userId: decodeToken.userId,
        token,
        expires: { $gt: new Date() },
      })
      .catch((err) => console.error(err));

    // Checking whether the user exists or not and also checking whether the token is expired or not
    if (!resetToken) {
      return res.status(500).json({ sucess: false, message: "Invalid Token" , redirectTo: "/auth/reset" , text: "to reset again."});
    } else {
      // Updating the password of the user with the new one provided by the user in the request body
      await resetTokenModel.updateOne({ verified: true });
      return res.json({
        success: true,
        message: "User verified",
      });
    }
  } catch (error) {
    return res.status(400).json({ sucess : false, error : error.message,  message: "Your link has been expired" , redirectTo: "/auth/reset" , text: "to reset again."});
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
    await createUserSchema.validateSync(req.body);

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const email = payload.email;

    // Finding the User from the database using the 'email' field
    const user = await userModel.findOne({ email });

    const resetToken = await resetTokenModel
      .findOne({
        userId: payload.userId,
        token,
        expires: { $gt: new Date() },
      })
      .catch((err) => console.error(err));

    try {
      if (resetToken.verified) {
        // If no such user found in the database then it will show 'No Such User Found.'
        if (!user) {
          return res.status(400).json({ message: "No Such User Found." , redirectTo: "/auth/reset" , text: "to reset again."});
        } else {
          // Checking whether the user exists or not and also checking whether the token is expired or not
          if (!resetToken) {
            return res.json({ sucess: false, message: "Invalid Token" , redirectTo: "/auth/reset" , text: "to reset again."});
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
              redirectTo: "/auth/reset" ,
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
              redirectTo: "/auth/reset" , text: "to reset again."
            });
          }
  
          // Remove the used verification code from the VerificationModel
          await resetTokenModel.findOneAndDelete({
            userId: payload.userId,
            token,
            expires: { $gt: new Date() },
          });
  
          return res.status(200).json({
            success: true,
            message: "Password reset successfully.", 
            redirectTo: "/auth/login" , 
            text: "to login again."
          });
        }
      }
    } catch (error) {
      return res.status(500).json({success:false,message: 'Your link has already used. Please try to generate again.' , redirectTo: "/auth/reset" , text: "to reset again."}); 
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error resetting password.`,
      redirectTo: "/auth/reset" , text: "to reset again."
    });
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
};
