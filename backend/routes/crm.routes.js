const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
  getOverview,
  listUsers,
  updateUserRole,
  updateUserBlock,
  getInterns,
  getInternshipApprovals,
  previewInternshipCertificateDraft,
  blockInternProfile,
  deleteInternProfile,
  reactivateInternProfile,
  approveInternKyc,
  rejectInternKyc,
  approveInternCertificate,
  listCertificateTypes,
  createCertificateType,
  updateCertificateType,
  deleteCertificateType,
  listCertificates,
  listCertificateTemplates,
  createCertificateTemplate,
  updateCertificateTemplate,
  deleteCertificateTemplate,
  uploadCertificateTemplatePdfFile,
  previewCertificateTemplate,
  deleteIssuedCertificate,
  previewIssuedCertificate,
  listTransactions,
  listInvites,
  createInvite,
  createInviteBulk,
  deleteInvite,
  deleteUser,
  recordOfferLetter,
  listIssuedOfferLetters,
} = require("../controllers/crmController");
const {
  listAdminCareersPrograms,
  getCareersProgram,
  createProgram,
  updateProgram,
  deleteProgram,
} = require("../controllers/careersProgramController");
const {
  getMyOfferLetters,
  getMyCertificates,
  getMyCertificatePdf,
  getMyOfferLetterPdf,
  getMyKycStatus,
  resubmitKyc,
} = require("../controllers/onboardController");
const { uploadKycDocuments } = require("../utils/kycUpload");
const { uploadCertificateTemplatePdf } = require("../utils/certificateTemplateUpload");

const router = express.Router();
const staff = roleMiddleware("admin", "manager");
const adminOnly = roleMiddleware("admin");
const managerOnly = roleMiddleware("manager");
const internOnly = roleMiddleware("intern");

router.get("/my/offer-letters", authMiddleware, internOnly, getMyOfferLetters);
router.get("/my/offer-letters/:id/pdf", authMiddleware, internOnly, getMyOfferLetterPdf);
router.get("/my/certificates", authMiddleware, internOnly, getMyCertificates);
router.get("/my/certificates/:id/pdf", authMiddleware, internOnly, getMyCertificatePdf);
router.get("/my/kyc-status", authMiddleware, internOnly, getMyKycStatus);
router.post("/my/kyc/resubmit", authMiddleware, internOnly, (req, res, next) => {
  uploadKycDocuments(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Invalid file upload" });
    }
    next();
  });
}, resubmitKyc);

router.use(authMiddleware);

router.get("/overview", adminOnly, getOverview);
router.get("/interns", staff, getInterns);
router.get("/internship-approvals", staff, getInternshipApprovals);
router.post(
  "/internship-approvals/preview-pdf",
  staff,
  previewInternshipCertificateDraft
);
router.patch("/interns/:id/block", adminOnly, blockInternProfile);
router.delete("/interns/:id", adminOnly, deleteInternProfile);
router.post("/interns/:id/reactivate", adminOnly, reactivateInternProfile);
router.post("/interns/:id/approve", staff, approveInternKyc);
router.post("/interns/:id/reject", staff, rejectInternKyc);
router.post("/interns/:id/approve-certificate", staff, approveInternCertificate);
router.get("/certificates", adminOnly, listCertificates);
router.get("/certificates/:id/preview", staff, previewIssuedCertificate);
router.delete("/certificates/:id", staff, deleteIssuedCertificate);
router.get("/certificate-types", staff, listCertificateTypes);
router.post("/certificate-types", adminOnly, createCertificateType);
router.patch("/certificate-types/:id", adminOnly, updateCertificateType);
router.delete("/certificate-types/:id", adminOnly, deleteCertificateType);
router.get("/certificate-templates", staff, listCertificateTemplates);
router.get("/certificate-templates/:id/preview", adminOnly, previewCertificateTemplate);
router.post("/certificate-templates/upload-pdf", adminOnly, (req, res, next) => {
  uploadCertificateTemplatePdf(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Invalid PDF upload" });
    }
    next();
  });
}, uploadCertificateTemplatePdfFile);
router.post("/certificate-templates", adminOnly, createCertificateTemplate);
router.patch("/certificate-templates/:id", adminOnly, updateCertificateTemplate);
router.delete("/certificate-templates/:id", adminOnly, deleteCertificateTemplate);
router.get("/transactions", adminOnly, listTransactions);
router.get("/offer-letters", adminOnly, listIssuedOfferLetters);
router.post("/offer-letters/record", adminOnly, recordOfferLetter);

router.get("/careers-programs", adminOnly, listAdminCareersPrograms);
router.get("/careers-programs/:slug", adminOnly, getCareersProgram);
router.post("/careers-programs", adminOnly, createProgram);
router.patch("/careers-programs/:id", adminOnly, updateProgram);
router.delete("/careers-programs/:id", adminOnly, deleteProgram);

router.get("/users", adminOnly, listUsers);
router.patch("/users/:id/role", adminOnly, updateUserRole);
router.patch("/users/:id/block", adminOnly, updateUserBlock);
router.delete("/users/:id", adminOnly, deleteUser);
router.get("/invites", staff, listInvites);
router.post("/invites", staff, createInvite);
router.post("/invites/bulk", staff, createInviteBulk);
router.delete("/invites/:id", staff, deleteInvite);

module.exports = router;
