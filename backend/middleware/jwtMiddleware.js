// jwtMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables from .env

const jwtMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

module.exports = jwtMiddleware;
