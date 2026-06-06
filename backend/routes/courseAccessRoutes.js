const express = require('express');
const courseAccessController = require('../controllers/courseAccessController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for payment
router.get("/fetchObj",authMiddleware, courseAccessController.getAllCoursesAndUsers);
router.post("/addObj",authMiddleware, courseAccessController.addCoursesToUsers);

// Route for payment status
// router.post('/callback', courseAccessController.callback);

module.exports = router;