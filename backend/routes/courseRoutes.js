const express = require('express');
const courseControler = require('../controllers/courseController');
const { uploadCourseToLib } = require('../utils/awsFileConfig');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

// Route to save videos in a folder
router.post('/save-course',authMiddleware, uploadCourseToLib,courseControler.saveCourseDetails);
router.post('/rate-course',authMiddleware,courseControler.rateCourse);

router.post('/get-course-watching', authMiddleware,courseControler.getEnrolledCourses);
// Route to get all videos in a folder
router.get('/get-all-course-details', courseControler.getAllCourseDetails);

router.get("/get-all-videos-tags/:tags/:courseId", courseControler.getCourseDetailsByTags)

// Route to get count of all curse in a folder
// router.get('/get-all-course-count', courseControler.getAllCourseDetailsCount);

module.exports = router;