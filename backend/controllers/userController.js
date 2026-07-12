const userModel = require('../models/userModel');

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

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    const userEmail = (user.email || "").toLowerCase();
    const effectiveRole =
      user.role === "admin" || adminEmails.includes(userEmail)
        ? "admin"
        : user.role || "student";

    const userPayload = user.toObject();
    userPayload.effectiveRole = effectiveRole;

    return res.json({ success: true, user: userPayload });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}; 

module.exports = { getUserDetails };
