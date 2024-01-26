const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.API_KEY;

const verifyEmail = async (email) => {
  try {
    const response = await axios.get(`https://api.apilayer.com/email_verification/${email}`, {
      headers: {
        'apikey': apiKey,
      },
    });    

    const verificationInfo = response.data;

    if (verificationInfo.is_deliverable) {
      return { success: true, message: 'Email is valid and deliverable' };
    } else {
      return { success: false, message: 'Email is not valid or not deliverable' };
    }
  } catch (error) { 
    console.error('Error verifying email:', error);
    return { success: false, message: 'Error verifying email' };
  }
};

module.exports = { verifyEmail };
