const userModel = require('../models/userModel');

const getUserDetails = async (req, res) => {
  try {
    // Get user details from the request object
    const userId = req.user.userId;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
    }

    // Fetch additional details from the database
    const user = await userModel.findOne({ userId });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found in the database' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 

module.exports = { getUserDetails };
