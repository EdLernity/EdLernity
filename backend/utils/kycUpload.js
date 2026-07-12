const path = require("path");
const fs = require("fs");
const multer = require("multer");
const aws = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
const region = "ap-south-1";

const kycFileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(new Error("Only JPG, PNG, WEBP, or PDF files are allowed"), false);
};

function buildStorage() {
  if (bucketName && accessKeyId && secretAccessKey) {
    const s3 = new aws.S3({
      region,
      accessKeyId,
      secretAccessKey,
      signatureVersion: "v4",
    });
    const multerS3 = require("multer-s3");
    return multerS3({
      s3,
      bucket: bucketName,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key(req, file, cb) {
        const owner = req.params.token || req.user?._id?.toString() || "unknown";
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        cb(null, `kyc/${owner}/${file.fieldname}-${Date.now()}-${safeName}`);
      },
    });
  }

  const uploadDir = path.join(__dirname, "../uploads/kyc");
  fs.mkdirSync(uploadDir, { recursive: true });
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      const owner = req.params.token || req.user?._id?.toString() || "unknown";
      const ext = path.extname(file.originalname);
      cb(null, `${owner}-${file.fieldname}-${Date.now()}${ext}`);
    },
  });
}

const uploadKycDocuments = multer({
  storage: buildStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: kycFileFilter,
}).fields([
  { name: "photo", maxCount: 1 },
  { name: "twelfthCertificate", maxCount: 1 },
  { name: "aadharFront", maxCount: 1 },
  { name: "aadharBack", maxCount: 1 },
  { name: "collegeId", maxCount: 1 },
]);

function getPublicFileUrl(req, file) {
  if (file.location) return file.location;
  const base =
    process.env.BACKEND_PUBLIC_URL ||
    `${req.protocol}://${req.get("host")}`;
  return `${base.replace(/\/$/, "")}/uploads/kyc/${path.basename(file.path)}`;
}

module.exports = {
  uploadKycDocuments,
  getPublicFileUrl,
};
