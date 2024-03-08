const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerMiddleware');
const { uploadFolder } = require('../controllers/cloudinaryController');

router.post('/upload-folder', upload.array('files',150), uploadFolder);

module.exports = router;

