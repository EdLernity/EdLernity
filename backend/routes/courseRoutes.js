const express = require('express');
const courseControler = require('../controllers/courseController');

const router = express.Router();

// Route to save videos in a folder
router.post('/save-course', courseControler.saveCourseDetails);

// Route to get all videos in a folder
router.get('/get-all-course-details', courseControler.getAllCourseDetails);
router.post('/save-video', courseControler.saveVideoName);

module.exports = router;