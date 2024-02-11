const multer = require('multer');

// Define Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp'); // Destination folder for temporary storage
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  }
});

// Initialize Multer with custom storage configuration
const upload = multer({ storage });

module.exports = upload;



  