const express = require('express');
const { getVideos , getVideoUrl } = require('../controllers/gcsController');

const router = express.Router();

// Route to get videos in a folder
router.get('/courses/:folderName', getVideos);

router.get('/courses/:folderName/:fileName', getVideoUrl);

module.exports = router;
