const crypto = require("crypto");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const CourseCertificate = require("../models/model.certfication");

const TYPE_CODES = {
  internship: "INT",
  course: "CRS",
  preview: "CRT",
};

const ID_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomSegment(length = 8) {
  const bytes = crypto.randomBytes(length);
  let segment = "";
  for (let i = 0; i < length; i += 1) {
    segment += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  }
  return segment;
}

function formatCertificateId(type = "internship", issuedAt = new Date()) {
  const year = new Date(issuedAt).getFullYear();
  const kind = TYPE_CODES[type] || TYPE_CODES.internship;
  return `EDL-${kind}-${year}-${randomSegment(8)}`;
}

async function isCertificateIdTaken(certificateId) {
  const normalized = String(certificateId || "").trim();
  if (!normalized) return true;

  const [internship, course] = await Promise.all([
    InternshipCertificate.exists({ uuid: normalized }),
    CourseCertificate.exists({ uuid: normalized }),
  ]);

  return Boolean(internship || course);
}

async function generateUniqueCertificateId(type = "internship", maxAttempts = 10) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const certificateId = formatCertificateId(type);
    if (!(await isCertificateIdTaken(certificateId))) {
      return certificateId;
    }
  }
  throw new Error("Unable to generate a unique certificate ID");
}

module.exports = {
  formatCertificateId,
  generateUniqueCertificateId,
  isCertificateIdTaken,
  TYPE_CODES,
};
