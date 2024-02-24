const express = require('express');
const courseControler = require('../controllers/courseController');

const router = express.Router();

// Route to get videos in a folder
router.post('/save-course', courseControler.saveCourseDetails);

module.exports = router;