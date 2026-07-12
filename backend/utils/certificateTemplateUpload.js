const path = require("path");
const fs = require("fs");
const multer = require("multer");
const aws = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
const region = process.env.AWS_SES_REGION || "ap-south-1";

const pdfFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
    return;
  }
  cb(new Error("Only PDF files are allowed"), false);
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
        const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        cb(null, `certificate-templates/${Date.now()}-${safeName}`);
      },
    });
  }

  const uploadDir = path.join(__dirname, "../uploads/certificate-templates");
  fs.mkdirSync(uploadDir, { recursive: true });
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, uploadDir);
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname) || ".pdf";
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_").replace(ext, "");
      cb(null, `${Date.now()}-${safeName}${ext}`);
    },
  });
}

const uploadCertificateTemplatePdf = multer({
  storage: buildStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: pdfFileFilter,
}).single("pdf");

function getPublicFileUrl(req, file) {
  if (file.location) return file.location;
  const base =
    process.env.BACKEND_PUBLIC_URL ||
    `${req.protocol}://${req.get("host")}`;
  return `${base.replace(/\/$/, "")}/uploads/certificate-templates/${path.basename(file.path)}`;
}

module.exports = {
  uploadCertificateTemplatePdf,
  getPublicFileUrl,
};
