const multer = require("multer");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const UserInternship = require("../models/userInternshipSchema");
const CourseCertificate = require("../models/model.certfication");
const { CertificateTemplate } = require("../models/certificateTemplateSchema");
const { resolveProgramTitle } = require("../utils/internshipCatalog");
const { normalizeUuid, extractUuidFromPdfBuffer } = require("../utils/extractPdfUuid");
const {
  buildInternshipCompletionPdf,
  resolveInternshipCertificateDates,
} = require("../utils/certificatePdfUtils");
const { resolveCertificateTemplateForProgram } = require("../utils/programTemplateService");

const uploadCertificatePdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf" || file.originalname?.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
      return;
    }
    cb(new Error("Only PDF files are allowed"), false);
  },
}).single("certificate");

function friendlyRecordType(certificateType, templateLabel) {
  const type = String(certificateType || "").trim();
  const label = String(templateLabel || "").trim();
  if (/non[\s-]*tech/i.test(label)) return "internship-completion";
  if (/tech/i.test(label) && !/non[\s-]*tech/i.test(label)) return "tech-internship";
  if (/appreciation/i.test(label)) return "certificate-of-appreciation";
  if (/best\s*performer/i.test(label)) return "best-performer";
  if (/participation|campus\s*influencer/i.test(label)) return "participation";
  if (type) return type;
  return "internship-completion";
}

async function lookupCertificate(uuid) {
  const internship = await InternshipCertificate.findOne({ uuid }).lean();
  if (internship) {
    const [enrollment, template] = await Promise.all([
      UserInternship.findOne({
        userId: internship.userId,
        internshipSlug: internship.internshipSlug,
      })
        .select("title")
        .lean(),
      internship.certificateTemplateId
        ? CertificateTemplate.findById(internship.certificateTemplateId)
            .select("label type")
            .lean()
        : null,
    ]);

    const templateLabel = template?.label || null;
    const certificateType =
      internship.certificateType || template?.type || "internship-completion";
    const issuedAt = internship.issuedAt || internship.toDate || internship.createdAt;

    return {
      valid: true,
      recordType: friendlyRecordType(certificateType, templateLabel),
      certificateType,
      templateLabel,
      uuid: internship.uuid,
      studentName: internship.studentName,
      programTitle: resolveProgramTitle(internship.internshipSlug, {
        enrollmentTitle: enrollment?.title,
        storedTitle: internship.programTitle,
      }),
      internshipSlug: internship.internshipSlug || null,
      fromDate: internship.fromDate || null,
      toDate: internship.toDate || null,
      issuedAt,
    };
  }

  const course = await CourseCertificate.findOne({ uuid })
    .populate("courseId", "courseTitle")
    .populate("userId", "firstName lastName email")
    .lean();

  if (course) {
    const studentName =
      `${course.userId?.firstName || ""} ${course.userId?.lastName || ""}`.trim() ||
      course.userId?.email ||
      "Student";
    return {
      valid: true,
      recordType: "course-completion",
      certificateType: "course-completion",
      templateLabel: "Course Completion Certificate",
      uuid: course.uuid,
      studentName,
      programTitle: course.courseId?.courseTitle || "Course",
      internshipSlug: null,
      fromDate: null,
      toDate: null,
      issuedAt: course.createdAt,
    };
  }

  return null;
}

function safeFilename(name) {
  return String(name || "EdLernity_Certificate")
    .trim()
    .replace(/[^\w\-]+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 80);
}

async function buildPdfBytesForUuid(uuid) {
  const internship = await InternshipCertificate.findOne({ uuid });
  if (internship) {
    let template = await resolveCertificateTemplateForProgram(
      internship.internshipSlug,
      internship.certificateTemplateId
    );
    if (!template?.pdfUrl) {
      template = await CertificateTemplate.findOne({
        type: internship.certificateType || "internship-completion",
        active: true,
      }).sort({ updatedAt: -1 });
    }
    if (!template?.pdfUrl) {
      throw Object.assign(new Error("No active certificate template found"), { status: 404 });
    }

    const { fromDate, toDate } = await resolveInternshipCertificateDates(internship);
    const enrollment = await UserInternship.findOne({
      userId: internship.userId,
      internshipSlug: internship.internshipSlug,
    }).select("title");
    const programTitle = resolveProgramTitle(internship.internshipSlug, {
      enrollmentTitle: enrollment?.title,
      storedTitle: internship.programTitle,
    });
    const issuedAt = internship.issuedAt || internship.toDate || internship.createdAt;

    const pdfBytes = await buildInternshipCompletionPdf({
      pdfUrl: template.pdfUrl,
      templateLabel: template.label,
      studentName: internship.studentName,
      programTitle,
      uuid: internship.uuid,
      issuedAt,
      fromDate,
      toDate,
    });

    return {
      pdfBytes,
      filename: `${safeFilename(internship.studentName)}_EdLernity_Certificate.pdf`,
    };
  }

  const course = await CourseCertificate.findOne({ uuid })
    .populate("courseId", "courseTitle")
    .populate("userId", "firstName lastName email");
  if (!course) {
    throw Object.assign(new Error("Certificate not found"), { status: 404 });
  }

  const template = await CertificateTemplate.findOne({
    type: "course-completion",
    active: true,
  }).sort({ updatedAt: -1 });
  if (!template?.pdfUrl) {
    throw Object.assign(new Error("No active course certificate template"), { status: 404 });
  }

  const studentName =
    `${course.userId?.firstName || ""} ${course.userId?.lastName || ""}`.trim() ||
    course.userId?.email ||
    "Student";
  const programTitle = course.courseId?.courseTitle || "Course";

  const pdfBytes = await buildInternshipCompletionPdf({
    pdfUrl: template.pdfUrl,
    templateLabel: template.label,
    studentName,
    programTitle,
    uuid: course.uuid,
    issuedAt: course.createdAt,
  });

  return {
    pdfBytes,
    filename: `${safeFilename(studentName)}_EdLernity_Certificate.pdf`,
  };
}

const verifyCertificateByUuid = async (req, res) => {
  try {
    const uuid = normalizeUuid(req.params.uuid || req.body?.uuid);
    if (!uuid) {
      return res.status(400).json({
        valid: false,
        message: "Please enter a valid certificate ID (e.g. EDL-INT-2026-A7K9M2P4).",
      });
    }

    const certificate = await lookupCertificate(uuid);
    if (!certificate) {
      return res.status(404).json({
        valid: false,
        message:
          "This certificate could not be verified. It may be invalid, expired, or not issued by EdLernity.",
      });
    }

    res.status(200).json({
      valid: true,
      message: "Certificate verified successfully. This is a genuine EdLernity certificate.",
      certificate,
    });
  } catch (err) {
    console.error("verifyCertificateByUuid error:", err);
    res.status(500).json({ valid: false, message: "Verification failed. Please try again." });
  }
};

const downloadCertificatePdfByUuid = async (req, res) => {
  try {
    const uuid = normalizeUuid(req.params.uuid);
    if (!uuid) {
      return res.status(400).json({ message: "Valid certificate ID is required" });
    }

    const { pdfBytes, filename } = await buildPdfBytesForUuid(uuid);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("downloadCertificatePdfByUuid error:", err);
    const status = err.status || 500;
    return res.status(status).json({
      message: err.message || "Failed to download certificate PDF",
    });
  }
};

const verifyCertificateUpload = async (req, res) => {
  try {
    if (!req.file?.buffer?.length) {
      return res.status(400).json({
        valid: false,
        message: "Please upload a PDF certificate file.",
      });
    }

    const extractedUuid = extractUuidFromPdfBuffer(req.file.buffer);
    if (!extractedUuid) {
      return res.status(400).json({
        valid: false,
        message:
          "Could not find a certificate ID in this PDF. Enter the certificate ID manually or upload the original EdLernity certificate.",
      });
    }

    const certificate = await lookupCertificate(extractedUuid);
    if (!certificate) {
      return res.status(404).json({
        valid: false,
        extractedUuid,
        message:
          "A certificate ID was found in the file, but it is not registered with EdLernity. This certificate may not be genuine.",
      });
    }

    res.status(200).json({
      valid: true,
      extractedUuid,
      message: "Certificate verified successfully. This is a genuine EdLernity certificate.",
      certificate,
    });
  } catch (err) {
    console.error("verifyCertificateUpload error:", err);
    res.status(500).json({ valid: false, message: "Verification failed. Please try again." });
  }
};

module.exports = {
  uploadCertificatePdf,
  verifyCertificateByUuid,
  verifyCertificateUpload,
  downloadCertificatePdfByUuid,
};
