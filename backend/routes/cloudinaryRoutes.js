const express = require('express');
const upload = require('../middleware/multerMiddleware.js');
const cloudinaryController = require('../controllers/cloudinaryController.js');

const router = express.Router();

router.post('/upload-folder', upload.array('files',10), cloudinaryController.uploadFolder);

module.exports = router;