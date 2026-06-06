const aws = require("aws-sdk");
const dotenv = require("dotenv");
const multer = require("multer");
const multerS3 = require("multer-s3");

dotenv.config();
const region = "ap-south-1";
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
//console.log(bucketName)
// S3 configuration
const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4",
});

const fileFilter = function(req, file, cb) {
    // Check if mimetype is video or image
    if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only video and image files are allowed.'), false);
    }
  };
  
  

// Multer configuration
const uploadVideos = multer({
    storage: multerS3({
      s3,
      bucket: bucketName,
      metadata: function(req, file, cb) {
       
        cb(null, { fieldName: file.fieldname });
      },
      key: function(req, file, cb) {
        const sectionName = req.body.folderName;
        let path = "courses/"+sectionName+"/";
        cb(null, path + file.originalname);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 * 1024 },
    fileFilter: fileFilter,
});

// Function to delete an object in S3
const deleteS3Object = function(key) {
  return new Promise((resolve, reject) => {
    s3.deleteObject({ Bucket: bucketName, Key: key }, (err, data) => {
      if (err) {
        console.error('Error deleting S3 object:', err);
        reject(err);
      } else {
        //console.log('S3 object deleted successfully:', data);
        resolve(data);
      }
    });
  });
};

const deleteS3ObjectsInBulk = async function(keys) {
  try {
    //console.log(keys);
    const params = {
      Bucket: bucketName,
      Delete: {
        Objects: keys.map(key => ({ Key: key })),
      },
    };
    await s3.deleteObjects(params).promise();
    //console.log('All S3 objects deleted successfully');
  } catch (error) {
    console.error('Error deleting S3 objects:', error);
  }
};

const uploadCourseToLib = uploadVideos.fields([
  { name: 'videoFiles', maxCount: 500 },
  { name: 'bannerFiles', maxCount: 1 },
]);


const deleteS3Objects = async function(keys) {
  // console.log(first)
  deleteS3ObjectsInBulk(keys);
};

module.exports = {
    uploadCourseToLib,
    deleteS3Objects,
   
};
 