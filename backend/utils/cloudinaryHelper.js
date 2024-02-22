const fs = require("fs");
const { Storage } = require('@google-cloud/storage');
const path = require("path")

const storage = new Storage({
  keyFilename :  path.join(__dirname, '../corded-photon-414013-b0c4f099a614.json'),
  projectId:'corded-photon-414013'
});

const bucketName = process.env.bucketName; // Replace with your bucket name

async function uploadToGCS(folderName, files) {
  try {

    const bucket = storage.bucket(bucketName);

    for (const file of files) {
      const filePath = `${folderName}/${file.originalname}`;
      await bucket.upload(file.path, {
        destination: filePath
      });
      fs.unlinkSync(file.path);
    }

    console.log('Files uploaded to Google Cloud Storage successfully.');
    return true;
  } catch (error) {
    console.error('Error uploading files to GCS:', error);
    return false;
  }
}


module.exports = uploadToGCS;



