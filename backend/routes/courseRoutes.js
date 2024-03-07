const express = require('express');
const courseControler = require('../controllers/courseController');

const router = express.Router();

// Route to save videos in a folder
router.post('/save-course', courseControler.saveCourseDetails);

// Route to get all videos in a folder
router.get('/get-all-course-details', courseControler.getAllCourseDetails);

// Route to get count of all curse in a folder
router.get('/get-all-course-count', courseControler.getAllCourseDetailsCount);

module.exports = router;