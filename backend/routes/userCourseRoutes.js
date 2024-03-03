// Example usage in routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createUserCourseController } = require('../controllers/userCourseController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Route to create user-course association
router.post('/user-course', authMiddleware , cacheMiddleware , createUserCourseController);

module.exports = router;
