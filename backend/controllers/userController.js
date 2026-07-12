const userModel = require('../models/userModel');
const { resolveEffectiveRole } = require('../utils/resolveEffectiveRole');

const getUserDetails = async (req, res) => {
  try {
    // Get user details from the request object
    const userId = req.user._id;
  
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found' });
    }

    // Fetch additional details from the database
    const user = await userModel.findById(userId).select("-password -googleAuth -isVerified");

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User not found in the database' });
    }

    const userPayload = user.toObject();
    userPayload.effectiveRole = resolveEffectiveRole(user);

    return res.json({ success: true, user: userPayload });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 

module.exports = { getUserDetails };
