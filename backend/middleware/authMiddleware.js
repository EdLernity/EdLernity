// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.userId;
        next();
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
