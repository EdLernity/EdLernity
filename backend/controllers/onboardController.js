const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const UserModel = require("../models/userModel");
const InternInvite = require("../models/internInviteSchema");
const InternKyc = require("../models/internKycSchema");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const UserInternship = require("../models/userInternshipSchema");
const IssuedOfferLetter = require("../models/issuedOfferLetterSchema");
const {
  CertificateTemplate,
} = require("../models/certificateTemplateSchema");
const { DEFAULT_CERTIFICATE_TEMPLATES } = require("../utils/certificateTemplateDefaults");
const {
  buildOfferLetterPdf,
} = require("../utils/offerLetterPdfUtils");
const { getCareersProgramBySlug } = require("../utils/careersProgramService");
const { buildInternshipCompletionPdf, resolveInternshipCertificateDates } = require("../utils/certificatePdfUtils");
const { resolveCertificateTemplateForProgram } = require("../utils/programTemplateService");
const { getInternshipBySlug, resolveProgramTitle } = require("../utils/internshipCatalog");
const { enrollInternshipRecord } = require("./controller.enroll");
const { generateSecurePassword } = require("../utils/passwordGenerator");
const sendEmail = require("../utils/sendEmail");

function getFrontendUrl() {
  return (
    process.env.FRONTEND_URL ||
    process.env.APPLICATION_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

function getCrmUrl() {
  return (
    process.env.CRM_URL ||
    process.env.REACT_APP_CRM_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
}

function buildInviteUrl(token) {
  return `${getCrmUrl()}/intern-onboard/${token}`;
}

function isGmailAddress(email) {
  return /^[a-z0-9.+]+@gmail\.com$/i.test(String(email || "").trim());
}

function splitFullName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" "),
  };
}

function requireUploadedFile(files, fieldName) {
  const file = files?.[fieldName]?.[0];
  if (!file) {
    throw new Error(`${fieldName} is required`);
  }
  return file;
}

async function generateUserId() {
  let userId;
  let exists = true;
  while (exists) {
    userId = Math.floor(10000000 + Math.random() * 90000000);
    exists = await UserModel.findOne({ userId });
  }
  return userId;
}

function inviteEmailHtml({ firstName, inviteUrl, message, programTitle }) {
  const name = firstName || "there";
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>You're invited to EdLernity</h2>
      <p>Hi ${name},</p>
      <p>You have been invited to join the <strong>${programTitle}</strong> program.</p>
      ${message ? `<p>${message}</p>` : ""}
      <p>Click the button below to complete onboarding and receive your login credentials.</p>
      <p><a href="${inviteUrl}" style="display:inline-block;padding:12px 20px;background:#181FC5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Complete Onboarding</a></p>
      <p style="font-size:13px;color:#666">Or copy this link: ${inviteUrl}</p>
      <p style="font-size:13px;color:#666">This link expires in 7 days.</p>
    </div>
  `;
}

function credentialsEmailHtml({ firstName, email, password, programTitle }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
      <h2>Welcome to EdLernity</h2>
      <p>Hi ${firstName || "Intern"},</p>
      <p>Your onboarding for <strong>${programTitle}</strong> is complete.</p>
      <p><strong>Email:</strong> ${email}<br/><strong>Password:</strong> ${password}</p>
      <p>Your offer letter will appear in the intern portal after admin or manager approval.</p>
      <p><a href="${getCrmUrl()}/signin">Login to Intern Portal</a></p>
    </div>
  `;
}

const getInviteByToken = async (req, res) => {
  try {
    const invite = await InternInvite.findOne({ token: req.params.token });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }
    if (invite.status === "accepted") {
      return res.status(400).json({ message: "This invite has already been used" });
    }
    if (invite.status === "cancelled") {
      return res.status(400).json({ message: "This invite was cancelled" });
    }
    if (new Date() > invite.expiresAt) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ message: "This invite has expired" });
    }

    const program = getInternshipBySlug(invite.internshipSlug);
    res.status(200).json({
      invite: {
        email: invite.email,
        firstName: invite.firstName,
        lastName: invite.lastName,
        internshipSlug: invite.internshipSlug,
        programTitle: program?.title || invite.internshipSlug,
        inviteMessage: invite.inviteMessage,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const completeOnboarding = async (req, res) => {
  try {
    const invite = await InternInvite.findOne({ token: req.params.token });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }
    if (invite.status !== "pending") {
      return res.status(400).json({ message: "Invite is no longer valid" });
    }
    if (new Date() > invite.expiresAt) {
      invite.status = "expired";
      await invite.save();
      return res.status(400).json({ message: "Invite has expired" });
    }

    const { fullName, collegeName, programName, phone } = req.body;
    const { getPublicFileUrl } = require("../utils/kycUpload");

    if (!fullName?.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }
    if (!collegeName?.trim()) {
      return res.status(400).json({ message: "College name is required" });
    }
    if (!programName?.trim()) {
      return res.status(400).json({ message: "Program name is required" });
    }

    const phoneRaw = String(phone || "").trim();
    if (!phoneRaw) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!/^\d{10}$/.test(phoneRaw)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
    }

    const email = invite.email.trim().toLowerCase();
    if (!isGmailAddress(email)) {
      return res.status(400).json({ message: "Only Gmail addresses are allowed for onboarding" });
    }

    let photoFile;
    let twelfthFile;
    let aadharFrontFile;
    let aadharBackFile;
    let collegeIdFile;
    try {
      photoFile = requireUploadedFile(req.files, "photo");
      twelfthFile = requireUploadedFile(req.files, "twelfthCertificate");
      aadharFrontFile = requireUploadedFile(req.files, "aadharFront");
      aadharBackFile = requireUploadedFile(req.files, "aadharBack");
      collegeIdFile = requireUploadedFile(req.files, "collegeId");
    } catch (fileErr) {
      const labelMap = {
        photo: "My Photo",
        twelfthCertificate: "12th Certificate/Marksheet",
        aadharFront: "Aadhar card Front",
        aadharBack: "Aadhar card Back",
        collegeId: "College Id card",
      };
      const field = String(fileErr.message || "").replace(" is required", "");
      return res.status(400).json({
        message: `${labelMap[field] || field} is required`,
      });
    }

    const program = getInternshipBySlug(invite.internshipSlug);
    if (!program) {
      return res.status(400).json({ message: "Invalid internship program" });
    }

    const { firstName, lastName } = splitFullName(fullName);
    if (!firstName) {
      return res.status(400).json({ message: "Full name is required" });
    }

    let user = await UserModel.findOne({ email });
    const plainPassword = generateSecurePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    if (user) {
      user.firstName = firstName;
      user.lastName = lastName || invite.lastName || "";
      user.phone = phoneRaw;
      user.role = "intern";
      if (!user.isVerified) user.isVerified = true;
      user.password = hashedPassword;
      // Password login must work in CRM even if they previously used Google on the learner site.
      user.isGoogleAuth = false;
      await user.save();
    } else {
      user = await UserModel.create({
        userId: await generateUserId(),
        firstName,
        lastName: lastName || invite.lastName || "",
        email,
        phone: phoneRaw,
        password: hashedPassword,
        isVerified: true,
        isGoogleAuth: false,
        role: "intern",
      });
    }

    await enrollInternshipRecord({
      userId: user._id,
      slug: invite.internshipSlug,
      paymentId: `invite-${invite._id}`,
      amount: "0",
      enrollmentSource: "invite",
    });

    await InternKyc.findOneAndUpdate(
      { userId: user._id, internshipSlug: invite.internshipSlug },
      {
        userId: user._id,
        inviteId: invite._id,
        internshipSlug: invite.internshipSlug,
        fullName: fullName.trim(),
        email,
        phone: phoneRaw,
        collegeName: collegeName.trim(),
        programName: programName.trim(),
        photoUrl: getPublicFileUrl(req, photoFile),
        twelfthCertificateUrl: getPublicFileUrl(req, twelfthFile),
        aadharFrontUrl: getPublicFileUrl(req, aadharFrontFile),
        aadharBackUrl: getPublicFileUrl(req, aadharBackFile),
        collegeIdUrl: getPublicFileUrl(req, collegeIdFile),
        approvalStatus: "pending",
        approvedAt: null,
        approvedBy: null,
        rejectedAt: null,
        rejectedBy: null,
        rejectionReason: "",
      },
      { upsert: true, new: true }
    );

    invite.status = "accepted";
    invite.userId = user._id;
    invite.acceptedAt = new Date();
    invite.firstName = user.firstName;
    invite.lastName = user.lastName;
    invite.onboardingPassword = plainPassword;
    await invite.save();

    const programTitle = program.title;
    await sendEmail.sendEmail(
      "Your EdLernity login credentials",
      email,
      credentialsEmailHtml({
        firstName: user.firstName,
        email,
        password: plainPassword,
        programTitle,
      }),
      `Login: ${email} Password: ${plainPassword}`
    );

    res.status(200).json({
      message: "Onboarding complete. Your application is pending admin or manager approval.",
      user: {
        email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      credentials: {
        email,
        password: plainPassword,
      },
      redirectTo: `${getCrmUrl()}/signin`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

async function resolveOfferLetterTemplate(letter) {
  if (letter?.offerLetterTemplateId) {
    const template = await CertificateTemplate.findById(letter.offerLetterTemplateId);
    if (template?.pdfUrl) return template;
  }

  const templateId = letter?.templateId;
  if (templateId && /^[a-f\d]{24}$/i.test(templateId)) {
    const template = await CertificateTemplate.findById(templateId);
    if (template?.pdfUrl) return template;
  }

  const templateType = templateId === "hr" ? "offer-letter-hr" : "offer-letter-marketing";
  let template = await CertificateTemplate.findOne({ type: templateType, active: true }).sort({
    updatedAt: -1,
  });
  if (!template) {
    const fallback = DEFAULT_CERTIFICATE_TEMPLATES.find((row) => row.type === templateType);
    if (!fallback) return null;
    return fallback;
  }
  return template;
}

async function resolveInternshipCertificateTemplate(certificate) {
  return resolveCertificateTemplateForProgram(
    certificate?.internshipSlug,
    certificate?.certificateTemplateId
  );
}

const getMyOfferLetters = async (req, res) => {
  try {
    const letters = await IssuedOfferLetter.find({ userId: req.user._id })
      .populate("issuedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      offerLetters: letters.map((row) => ({
        id: row._id,
        internshipSlug: row.internshipSlug,
        candidateName: row.candidateName,
        templateLabel: row.templateLabel,
        issuedAt: row.createdAt,
        issuedBy: row.issuedBy
          ? `${row.issuedBy.firstName || ""} ${row.issuedBy.lastName || ""}`.trim()
          : null,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyOfferLetterPdf = async (req, res) => {
  try {
    const letter = await IssuedOfferLetter.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!letter) {
      return res.status(404).json({ message: "Offer letter not found" });
    }

    const template = await resolveOfferLetterTemplate(letter);
    if (!template?.pdfUrl) {
      return res.status(404).json({ message: "Offer letter template not found" });
    }

    const program = await getCareersProgramBySlug(letter.internshipSlug, { includeInactive: true });

    const pdfBytes = await buildOfferLetterPdf({
      pdfUrl: template.pdfUrl,
      candidateName: letter.candidateName,
      issuedAt: letter.createdAt,
      templateLabel: template.label,
      programTitle: program?.title || "",
      programDomain: program?.category || program?.trackLabel || "",
      roleDescription: program?.offerLetterRoleDescription || "",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${letter.candidateName.replace(/\s+/g, "_")}_offer_letter.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate offer letter" });
  }
};

const getMyCertificates = async (req, res) => {
  try {
    const certificates = await InternshipCertificate.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    const enrollments = await UserInternship.find({ userId: req.user._id }).select(
      "internshipSlug title"
    );
    const enrollmentTitleBySlug = new Map(
      enrollments.map((row) => [row.internshipSlug, row.title])
    );
    const templateIds = certificates.map((row) => row.certificateTemplateId).filter(Boolean);
    const templates = await CertificateTemplate.find({ _id: { $in: templateIds } });
    const templateMap = new Map(templates.map((row) => [String(row._id), row]));

    res.status(200).json({
      certificates: certificates.map((row) => {
        const template = row.certificateTemplateId
          ? templateMap.get(String(row.certificateTemplateId))
          : null;
        return {
          id: row._id,
          uuid: row.uuid,
          studentName: row.studentName,
          programTitle: resolveProgramTitle(row.internshipSlug, {
            enrollmentTitle: enrollmentTitleBySlug.get(row.internshipSlug),
            storedTitle: row.programTitle,
          }),
          internshipSlug: row.internshipSlug,
          templateLabel: template?.label || "Internship Certificate",
          certificateType: row.certificateType || template?.type || "internship-completion",
          issuedAt: row.issuedAt || row.createdAt,
        };
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyCertificatePdf = async (req, res) => {
  try {
    const certificate = await InternshipCertificate.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const template = await resolveInternshipCertificateTemplate(certificate);
    if (!template?.pdfUrl) {
      return res.status(404).json({ message: "Certificate template not found" });
    }

    const { fromDate, toDate } = await resolveInternshipCertificateDates(certificate);
    const enrollment = await UserInternship.findOne({
      userId: req.user._id,
      internshipSlug: certificate.internshipSlug,
    }).select("title");
    const programTitle = resolveProgramTitle(certificate.internshipSlug, {
      enrollmentTitle: enrollment?.title,
      storedTitle: certificate.programTitle,
    });

    const pdfBytes = await buildInternshipCompletionPdf({
      pdfUrl: template.pdfUrl,
      templateLabel: template.label,
      studentName: certificate.studentName,
      programTitle,
      uuid: certificate.uuid,
      issuedAt: certificate.issuedAt || certificate.createdAt,
      fromDate,
      toDate,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${certificate.studentName.replace(/\s+/g, "_")}_certificate.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};

const getMyKycStatus = async (req, res) => {
  try {
    const { internshipSlug } = req.query;
    let kyc = null;

    if (internshipSlug) {
      kyc = await InternKyc.findOne({ userId: req.user._id, internshipSlug });
    } else {
      kyc = await InternKyc.findOne({ userId: req.user._id }).sort({ updatedAt: -1 });
    }

    if (!kyc) {
      return res.status(200).json({ kyc: null });
    }

    res.status(200).json({
      kyc: {
        fullName: kyc.fullName,
        email: kyc.email,
        phone: kyc.phone,
        collegeName: kyc.collegeName,
        programName: kyc.programName,
        approvalStatus: kyc.approvalStatus || "pending",
        rejectionReason: kyc.rejectionReason || "",
        rejectedAt: kyc.rejectedAt,
        submittedAt: kyc.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const resubmitKyc = async (req, res) => {
  try {
    const { internshipSlug } = req.body;
    let kyc = null;

    if (internshipSlug) {
      kyc = await InternKyc.findOne({ userId: req.user._id, internshipSlug });
    } else {
      kyc = await InternKyc.findOne({
        userId: req.user._id,
        approvalStatus: "rejected",
      }).sort({ updatedAt: -1 });
    }

    if (!kyc) {
      return res.status(400).json({ message: "No KYC record found" });
    }
    if ((kyc.approvalStatus || "pending") !== "rejected") {
      return res.status(400).json({ message: "Only rejected applications can be resubmitted" });
    }

    const { fullName, collegeName, programName, phone } = req.body;
    const { getPublicFileUrl } = require("../utils/kycUpload");

    if (!fullName?.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }
    if (!collegeName?.trim()) {
      return res.status(400).json({ message: "College name is required" });
    }
    if (!programName?.trim()) {
      return res.status(400).json({ message: "Program name is required" });
    }

    const phoneRaw = String(phone || "").trim();
    if (!phoneRaw) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    if (!/^\d{10}$/.test(phoneRaw)) {
      return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
    }

    let photoFile;
    let twelfthFile;
    let aadharFrontFile;
    let aadharBackFile;
    let collegeIdFile;
    try {
      photoFile = requireUploadedFile(req.files, "photo");
      twelfthFile = requireUploadedFile(req.files, "twelfthCertificate");
      aadharFrontFile = requireUploadedFile(req.files, "aadharFront");
      aadharBackFile = requireUploadedFile(req.files, "aadharBack");
      collegeIdFile = requireUploadedFile(req.files, "collegeId");
    } catch (fileErr) {
      const labelMap = {
        photo: "My Photo",
        twelfthCertificate: "12th Certificate/Marksheet",
        aadharFront: "Aadhar card Front",
        aadharBack: "Aadhar card Back",
        collegeId: "College Id card",
      };
      const field = String(fileErr.message || "").replace(" is required", "");
      return res.status(400).json({
        message: `${labelMap[field] || field} is required`,
      });
    }

    const { firstName, lastName } = splitFullName(fullName);
    const user = await UserModel.findById(req.user._id);
    if (user) {
      user.firstName = firstName;
      user.lastName = lastName || user.lastName || "";
      user.phone = phoneRaw;
      await user.save();
    }

    kyc.fullName = fullName.trim();
    kyc.phone = phoneRaw;
    kyc.collegeName = collegeName.trim();
    kyc.programName = programName.trim();
    kyc.photoUrl = getPublicFileUrl(req, photoFile);
    kyc.twelfthCertificateUrl = getPublicFileUrl(req, twelfthFile);
    kyc.aadharFrontUrl = getPublicFileUrl(req, aadharFrontFile);
    kyc.aadharBackUrl = getPublicFileUrl(req, aadharBackFile);
    kyc.collegeIdUrl = getPublicFileUrl(req, collegeIdFile);
    kyc.approvalStatus = "pending";
    kyc.rejectedAt = null;
    kyc.rejectedBy = null;
    kyc.rejectionReason = "";
    kyc.approvedAt = null;
    kyc.approvedBy = null;
    await kyc.save();

    res.status(200).json({
      message: "Verification resubmitted. Awaiting admin or manager approval.",
      approvalStatus: "pending",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getInviteByToken,
  completeOnboarding,
  getMyOfferLetters,
  getMyOfferLetterPdf,
  getMyCertificates,
  getMyCertificatePdf,
  getMyKycStatus,
  resubmitKyc,
  inviteEmailHtml,
  credentialsEmailHtml,
  getFrontendUrl,
  getCrmUrl,
  buildInviteUrl,
  isGmailAddress,
};
