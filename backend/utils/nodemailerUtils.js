require('dotenv').config(); // Load environment variables from .env file
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Replace with your email
    pass: process.env.EMAIL_PASS, // Replace with your email password
  },
});

// Function to send a verification email 
const sendVerificationCodeEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Replace with your email
      to: email,
      subject: 'Account Verification',
      text: `The Verification Code is ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};


const sendVerificationEmail = async (email,subject,text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Replace with your email
      to: email,
      subject: subject,
      html: text,
    };

    await transporter.sendMail(mailOptions);
    return 'Verification email sent';
  } catch (error) {
    console.error('Error sending verification email:', error);
    return 'Failed to send verification email';
  }
};

// Function to generate a random six-digit verification code
const generateVerificationCode = () => {
  const min = 100000; // Minimum value for a six-digit number
  const max = 999999; // Maximum value for a six-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports = { sendVerificationCodeEmail , sendVerificationEmail,  generateVerificationCode,};
