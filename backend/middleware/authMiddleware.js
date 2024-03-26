// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { sendErrorResponse } = require('../utils/ApiReqRes');
const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    
    
    if(authHeader == null)
    return res.status(401).json({ success: false, message: "No Token Provided" });

    const [, token] = authHeader?.split(' ');

    if (!token) {
        return sendErrorResponse(res, 401, "Unauthorized request");
      }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await UserModel.findById(decodedToken?.userId).select(
            "-password"
          );
      
          if (!user) {
           
            return sendErrorResponse(res, 401, "Session Expired");
          }
        req.user = user;
        next();
        
    } catch (error) {
        console.log(error)
        return sendErrorResponse(res, 401, "Session Expired");
    }
};

module.exports = authMiddleware;
