const fs = require("fs");
const path = require("path");
const aws = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config();

const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
const region = process.env.AWS_SES_REGION || process.env.AWS_REGION || "ap-south-1";

function getS3Client() {
  if (!bucketName || !accessKeyId || !secretAccessKey) return null;
  return new aws.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
  });
}

function extractS3KeyFromUrl(fileUrl) {
  if (!fileUrl || !bucketName) return null;

  try {
    const url = new URL(fileUrl);
    const host = url.hostname.toLowerCase();
    const pathname = decodeURIComponent(url.pathname.replace(/^\//, ""));

    if (host === `${bucketName}.s3.${region}.amazonaws.com` || host.startsWith(`${bucketName}.s3.`)) {
      return pathname;
    }

    if (host === `s3.${region}.amazonaws.com` || host.startsWith("s3.")) {
      const [urlBucket, ...rest] = pathname.split("/");
      if (urlBucket === bucketName) return rest.join("/");
    }

    if (fileUrl.includes(bucketName) && (pathname.startsWith("certificate-templates/") || pathname.startsWith("kyc/"))) {
      return pathname;
    }
  } catch {
    return null;
  }

  return null;
}

function extractLocalUploadPath(fileUrl) {
  if (!fileUrl) return null;

  const markers = ["/uploads/certificate-templates/", "/uploads/kyc/"];
  for (const marker of markers) {
    const index = fileUrl.indexOf(marker);
    if (index === -1) continue;
    const relative = fileUrl.slice(index + marker.length).split("?")[0];
    if (!relative) continue;
    const folder = marker.includes("kyc") ? "kyc" : "certificate-templates";
    return path.join(__dirname, "..", "uploads", folder, path.basename(relative));
  }

  return null;
}

function isManagedStoredFile(fileUrl) {
  if (!fileUrl) return false;
  if (fileUrl.includes("/uploads/certificate-templates/") || fileUrl.includes("/uploads/kyc/")) {
    return true;
  }
  if (bucketName && fileUrl.includes(bucketName)) return true;
  if (fileUrl.includes("certificate-templates/") && fileUrl.includes(".amazonaws.com")) return true;
  if (fileUrl.includes("/kyc/") && fileUrl.includes(".amazonaws.com")) return true;
  return false;
}

async function deleteS3ObjectByKey(key) {
  const s3 = getS3Client();
  if (!s3 || !key) return false;

  try {
    await s3.deleteObject({ Bucket: bucketName, Key: key }).promise();
    return true;
  } catch (err) {
    console.error("Failed to delete S3 object:", key, err.message);
    return false;
  }
}

async function deleteLocalUploadFile(filePath) {
  if (!filePath) return false;
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Failed to delete local upload file:", filePath, err.message);
    }
    return false;
  }
}

async function deleteStoredFile(fileUrl) {
  if (!isManagedStoredFile(fileUrl)) return false;

  const s3Key = extractS3KeyFromUrl(fileUrl);
  if (s3Key) {
    return deleteS3ObjectByKey(s3Key);
  }

  const localPath = extractLocalUploadPath(fileUrl);
  if (localPath) {
    return deleteLocalUploadFile(localPath);
  }

  return false;
}

async function deleteStoredFiles(fileUrls = []) {
  const uniqueUrls = [...new Set(fileUrls.filter(Boolean))];
  const results = await Promise.all(uniqueUrls.map((url) => deleteStoredFile(url)));
  return results.filter(Boolean).length;
}

function collectKycFileUrls(kyc) {
  if (!kyc) return [];
  return [
    kyc.photoUrl,
    kyc.twelfthCertificateUrl,
    kyc.aadharFrontUrl,
    kyc.aadharBackUrl,
    kyc.collegeIdUrl,
  ].filter(Boolean);
}

module.exports = {
  isManagedStoredFile,
  deleteStoredFile,
  deleteStoredFiles,
  collectKycFileUrls,
  extractS3KeyFromUrl,
  extractLocalUploadPath,
};
