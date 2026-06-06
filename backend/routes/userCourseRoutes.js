// Example usage in routes
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createUserCourseController , getUserCourseByIdController } = require('../controllers/userCourseController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Route to create user-course association
router.post('/user-course', authMiddleware , cacheMiddleware , createUserCourseController);


// Route to get user-course association by id
router.get('/get-course-by-id' , getUserCourseByIdController);

module.exports = router;
