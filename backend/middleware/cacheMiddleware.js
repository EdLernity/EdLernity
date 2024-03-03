// middleware/cacheMiddleware.js
const NodeCache = require('node-cache');
const cache = new NodeCache();

const cacheMiddleware = (req, res, next) => {
    const cacheKey = req.originalUrl; // Use the request URL as the cache key
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
        // If data is found in cache, send it back as response
        console.log('Data retrieved from cache');
        return res.json({ success: true, data: cachedData });
    } else {
        // If data is not found in cache, proceed to the next middleware or route handler
        next();
    }
};

module.exports = { cacheMiddleware, cache };
