const uploadToGCS = require('../utils/cloudinaryHelper');
const fs = require("fs");

const uploadFolder = async (req, res) => {
  const { folderName } = req.body;
  const files = req.files;

  if (!folderName || !files || files.length === 0) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  try {
    await uploadToGCS(folderName, files);
    return res.status(200).json({ message: 'Folder uploaded successfully' });
  } catch (error) {
    console.error('Error uploading folder:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { uploadFolder };


