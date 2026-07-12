const UserModel = require("../models/userModel");
const UserInternship = require("../models/userInternshipSchema");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const Transaction = require("../models/transactionSchema");
const UserCourse = require("../models/userCourseSchema");
const InternInvite = require("../models/internInviteSchema");
const InternKyc = require("../models/internKycSchema");
const IssuedOfferLetter = require("../models/issuedOfferLetterSchema");
const CourseCertificate = require("../models/model.certfication");
const {
  CertificateTemplate,
} = require("../models/certificateTemplateSchema");
const { DEFAULT_CERTIFICATE_TEMPLATES } = require("../utils/certificateTemplateDefaults");
const {
  listCertificateTypes,
  createCertificateType,
  updateCertificateType,
  deleteCertificateType,
  assertCertificateTypeExists,
  getIssuableCertificateTypeSlugs,
  normalizeTypeSlug,
} = require("../utils/certificateTypeService");
const { buildInternshipCompletionPdf, resolveInternshipCertificateDates } = require("../utils/certificatePdfUtils");
const { buildOfferLetterPdf, isOfferLetterTemplate } = require("../utils/offerLetterPdfUtils");
const { resolveOfferLetterForProgram, resolveCertificateTemplateForProgram } = require("../utils/programTemplateService");
const { v4: uuidv4 } = require("uuid");
const { generateUniqueCertificateId } = require("../utils/certificateIdGenerator");
const { getInternshipBySlug, resolveProgramTitle } = require("../utils/internshipCatalog");
const { findKycForProgram, pickKycFromList, pickCertificatesFromList } = require("../utils/internKycService");
const {
  CERTIFICATE_ISSUE_LOCK_DAYS,
  getCertificateLockStartDate,
  getCertificateEligibleAt,
  isCertificateUnlocked,
  getCertificateLockDaysRemaining,
  requiresCompletionLock,
} = require("../utils/certificateIssueRules");
const sendEmail = require("../utils/sendEmail");
const { inviteEmailHtml, buildInviteUrl, isGmailAddress } = require("./onboardController");
const { getPublicFileUrl } = require("../utils/certificateTemplateUpload");
const {
  deleteStoredFile,
  deleteStoredFiles,
  collectKycFileUrls,
} = require("../utils/storedFileDelete");

function mapKycSummary(kyc, viewerRole) {
  if (!kyc) return null;

  const summary = {
    fullName: kyc.fullName,
    email: kyc.email,
    phone: kyc.phone,
    collegeName: kyc.collegeName,
    programName: kyc.programName,
    submittedAt: kyc.createdAt,
    approvalStatus: kyc.approvalStatus || "approved",
    approvedAt: kyc.approvedAt,
    rejectionReason: kyc.rejectionReason || "",
    rejectedAt: kyc.rejectedAt,
  };

  if (viewerRole === "admin" || viewerRole === "manager") {
    summary.photoUrl = kyc.photoUrl;
    summary.twelfthCertificateUrl = kyc.twelfthCertificateUrl;
    summary.aadharFrontUrl = kyc.aadharFrontUrl;
    summary.aadharBackUrl = kyc.aadharBackUrl;
    summary.collegeIdUrl = kyc.collegeIdUrl;
  }

  return summary;
}

function mapIssuedCertificate(row, templateMap) {
  const template = row.certificateTemplateId
    ? templateMap.get(String(row.certificateTemplateId))
    : null;
  return {
    id: row._id,
    uuid: row.uuid,
    studentName: row.studentName,
    programTitle: row.programTitle,
    templateId: row.certificateTemplateId ? String(row.certificateTemplateId) : null,
    templateLabel: template?.label || "Internship Certificate",
    certificateType: row.certificateType || template?.type || "internship-completion",
    issuedAt: row.createdAt,
  };
}

function buildCertificateMeta(programCertificates, kyc, enrollment) {
  const lockStart = getCertificateLockStartDate(kyc, enrollment);
  const certificateEligibleAt = getCertificateEligibleAt(lockStart);
  const certificateUnlocked = isCertificateUnlocked(certificateEligibleAt);
  const primary = programCertificates[0] || null;

  return {
    certificates: programCertificates,
    certificate: primary
      ? {
          issued: true,
          uuid: primary.uuid,
          studentName: primary.studentName,
          programTitle: primary.programTitle,
          issuedAt: primary.issuedAt,
        }
      : { issued: false },
    certificateEligibleAt,
    certificateUnlocked,
    certificateLockDaysRemaining: getCertificateLockDaysRemaining(certificateEligibleAt),
    certificateLockDays: CERTIFICATE_ISSUE_LOCK_DAYS,
  };
}

const getOverview = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      students,
      trainers,
      admins,
      managers,
      verifiedUsers,
      blockedUsers,
      totalEnrollments,
      enrollmentsThisMonth,
      totalCertificates,
      transactions,
      recentUsers,
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ role: "student" }),
      UserModel.countDocuments({ role: "trainer" }),
      UserModel.countDocuments({ role: "admin" }),
      UserModel.countDocuments({ role: "manager" }),
      UserModel.countDocuments({ isVerified: true }),
      UserModel.countDocuments({ IsBlocked: true }),
      UserInternship.countDocuments(),
      UserInternship.countDocuments({ createdAt: { $gte: startOfMonth } }),
      InternshipCertificate.countDocuments(),
      Transaction.find({}).select("amount"),
      UserModel.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("firstName lastName email role createdAt"),
    ]);

    const totalRevenue = transactions.reduce((sum, row) => {
      const amount = parseFloat(row.amount) || 0;
      return sum + amount;
    }, 0);

    res.status(200).json({
      stats: {
        totalUsers,
        usersByRole: { student: students, trainer: trainers, admin: admins, manager: managers },
        verifiedUsers,
        blockedUsers,
        totalEnrollments,
        enrollmentsThisMonth,
        totalCertificates,
        totalRevenue,
        transactionCount: transactions.length,
      },
      recentUsers: recentUsers.map((u) => ({
        id: u._id,
        name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const listUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;
    const { search, role, blocked } = req.query;

    const filter = {};
    if (role && ["student", "trainer", "admin", "manager", "intern"].includes(role)) {
      filter.role = role;
    }
    if (blocked === "true") filter.IsBlocked = true;
    if (blocked === "false") filter.IsBlocked = { $ne: true };
    if (search?.trim()) {
      const term = search.trim();
      filter.$or = [
        { email: { $regex: term, $options: "i" } },
        { firstName: { $regex: term, $options: "i" } },
        { lastName: { $regex: term, $options: "i" } },
        { phone: { $regex: term, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("firstName lastName email phone role isVerified IsBlocked createdAt"),
      UserModel.countDocuments(filter),
    ]);

    res.status(200).json({
      users: users.map((u) => ({
        id: u._id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isVerified: u.isVerified,
        isBlocked: u.IsBlocked,
        createdAt: u.createdAt,
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["student", "trainer", "admin", "manager", "intern"].includes(role)) {
      return res.status(400).json({ message: "Valid role is required" });
    }

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User role updated to ${role}`,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUserBlock = async (req, res) => {
  try {
    const { blocked } = req.body;
    if (typeof blocked !== "boolean") {
      return res.status(400).json({ message: "blocked must be a boolean" });
    }

    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.IsBlocked = blocked;
    await user.save();

    res.status(200).json({
      message: blocked ? "User blocked" : "User unblocked",
      user: { id: user._id, email: user.email, isBlocked: user.IsBlocked },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getInterns = async (req, res) => {
  try {
    const internUsers = await UserModel.find({ role: "intern" })
      .select("firstName lastName email phone role IsBlocked createdAt")
      .sort({ createdAt: -1 });

    const userIds = internUsers.map((user) => user._id);

    const issuableTypeSlugs = await getIssuableCertificateTypeSlugs();
    const [kycRecords, enrollments, certificates, certificateTemplates] = await Promise.all([
      InternKyc.find({ userId: { $in: userIds } }),
      UserInternship.find({ userId: { $in: userIds } }).sort({ createdAt: -1 }),
      InternshipCertificate.find({ userId: { $in: userIds } }),
      CertificateTemplate.find({
        type: { $in: issuableTypeSlugs },
        active: true,
      }).select("_id label type"),
    ]);

    const templateMap = new Map(certificateTemplates.map((row) => [String(row._id), row]));

    const enrollmentsByUser = new Map();
    for (const enrollment of enrollments) {
      const key = String(enrollment.userId);
      if (!enrollmentsByUser.has(key)) enrollmentsByUser.set(key, []);
      enrollmentsByUser.get(key).push(enrollment);
    }

    const interns = [];
    for (const user of internUsers) {
      const userKey = String(user._id);
      const userEnrollments = enrollmentsByUser.get(userKey) || [];

      if (!userEnrollments.length) {
        const kyc = kycRecords.find((row) => String(row.userId) === userKey) || null;
        const programCertificates = certificates
          .filter((row) => String(row.userId) === userKey)
          .map((row) => mapIssuedCertificate(row, templateMap));
        const certificateMeta = buildCertificateMeta(programCertificates, kyc, null);
        interns.push({
          id: userKey,
          student: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || kyc?.phone || "",
            isBlocked: user.IsBlocked,
            joinedAt: user.createdAt,
          },
          kyc: mapKycSummary(kyc, req.userRole),
          enrollment: null,
          ...certificateMeta,
        });
        continue;
      }

      for (const enrollment of userEnrollments) {
        const program = getInternshipBySlug(enrollment.internshipSlug);
        const programTemplateId = program?.certificateTemplateId
          ? String(program.certificateTemplateId)
          : null;
        const programTemplate = programTemplateId ? templateMap.get(programTemplateId) : null;
        const kyc = pickKycFromList(kycRecords, user._id, enrollment.internshipSlug);
        const issuedRows = pickCertificatesFromList(
          certificates,
          user._id,
          enrollment.internshipSlug
        );
        const programCertificates = issuedRows.map((row) => mapIssuedCertificate(row, templateMap));
        const certificateMeta = buildCertificateMeta(programCertificates, kyc, enrollment);

        interns.push({
          id: `${userKey}-${enrollment.internshipSlug}`,
          student: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || kyc?.phone || "",
            isBlocked: user.IsBlocked,
            joinedAt: user.createdAt,
          },
          kyc: mapKycSummary(kyc, req.userRole),
          enrollment: {
            internshipSlug: enrollment.internshipSlug,
            programTitle: program?.title || enrollment.title || enrollment.internshipSlug,
            enrolledAt: enrollment.createdAt,
            enrollmentSource: enrollment.enrollmentSource || "invite",
            certificateTemplateId: programTemplateId,
            certificateTemplateLabel: programTemplate?.label || null,
          },
          ...certificateMeta,
        });
      }
    }

    res.status(200).json({ interns });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

async function findInternUser(userId, res) {
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404).json({ message: "Intern not found" });
    return null;
  }
  if (user.role !== "intern") {
    res.status(400).json({ message: "This action is only available for career intern accounts" });
    return null;
  }
  return user;
}

const blockInternProfile = async (req, res) => {
  try {
    const { blocked } = req.body;
    if (typeof blocked !== "boolean") {
      return res.status(400).json({ message: "blocked must be a boolean" });
    }

    const user = await findInternUser(req.params.id, res);
    if (!user) return;

    user.IsBlocked = blocked;
    await user.save();

    res.status(200).json({
      message: blocked ? "Intern blocked" : "Intern unblocked",
      user: { id: user._id, email: user.email, isBlocked: user.IsBlocked },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteInternProfile = async (req, res) => {
  try {
    const user = await findInternUser(req.params.id, res);
    if (!user) return;

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const kycRecords = await InternKyc.find({ userId: user._id });
    const kycFileUrls = kycRecords.flatMap((row) => collectKycFileUrls(row));

    await Promise.all([
      UserInternship.deleteMany({ userId: user._id }),
      InternInvite.updateMany({ userId: user._id }, { $set: { userId: null } }),
      UserCourse.deleteMany({ userId: user._id }),
      InternshipCertificate.deleteMany({ userId: user._id }),
      IssuedOfferLetter.deleteMany({ userId: user._id }),
      InternKyc.deleteMany({ userId: user._id }),
    ]);

    await deleteStoredFiles(kycFileUrls);
    await user.deleteOne();
    res.status(200).json({ message: "Intern deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

async function resolveInternshipSlugForUser(userId, requestedSlug) {
  if (requestedSlug) return requestedSlug;

  const enrollment = await UserInternship.findOne({ userId }).sort({ createdAt: -1 });
  return enrollment?.internshipSlug || null;
}

const approveInternKyc = async (req, res) => {
  try {
    const user = await findInternUser(req.params.id, res);
    if (!user) return;

    const internshipSlug = await resolveInternshipSlugForUser(user._id, req.body?.internshipSlug);
    if (!internshipSlug) {
      return res.status(400).json({ message: "Intern is not enrolled in a program" });
    }

    const kyc = await findKycForProgram(user._id, internshipSlug);
    if (!kyc) {
      return res.status(400).json({ message: "No KYC submission found for this internship program" });
    }

    const currentStatus = kyc.approvalStatus || "pending";
    if (currentStatus === "approved") {
      return res.status(400).json({ message: "Intern is already approved" });
    }
    if (currentStatus === "rejected") {
      return res.status(400).json({ message: "This application was rejected" });
    }

    const enrollment = await UserInternship.findOne({ userId: user._id, internshipSlug });
    if (!enrollment) {
      return res.status(400).json({ message: "Intern is not enrolled in this program" });
    }

    kyc.approvalStatus = "approved";
    kyc.approvedAt = new Date();
    kyc.approvedBy = req.user._id;
    kyc.rejectedAt = null;
    kyc.rejectedBy = null;
    kyc.rejectionReason = "";
    await kyc.save();

    const templateMeta = await resolveOfferLetterForProgram(internshipSlug);
    const existingLetter = await IssuedOfferLetter.findOne({
      userId: user._id,
      internshipSlug,
    });

    if (!existingLetter) {
      await IssuedOfferLetter.create({
        userId: user._id,
        internshipSlug,
        candidateName: kyc.fullName,
        templateId: templateMeta.templateId,
        templateLabel: templateMeta.templateLabel,
        offerLetterTemplateId: templateMeta.offerLetterTemplateId,
        issuedBy: req.user._id,
        emailSent: false,
      });
    }

    res.status(200).json({
      message: "Intern approved. Offer letter is now available in their portal.",
      approvalStatus: "approved",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const rejectInternKyc = async (req, res) => {
  try {
    const user = await findInternUser(req.params.id, res);
    if (!user) return;

    const internshipSlug = await resolveInternshipSlugForUser(user._id, req.body?.internshipSlug);
    if (!internshipSlug) {
      return res.status(400).json({ message: "Intern is not enrolled in a program" });
    }

    const kyc = await findKycForProgram(user._id, internshipSlug);
    if (!kyc) {
      return res.status(400).json({ message: "No KYC submission found for this internship program" });
    }

    const currentStatus = kyc.approvalStatus || "pending";
    if (currentStatus === "approved") {
      return res.status(400).json({ message: "Cannot reject an already approved application" });
    }
    if (currentStatus === "rejected") {
      return res.status(400).json({ message: "Application is already rejected" });
    }

    const { reason } = req.body;
    kyc.approvalStatus = "rejected";
    kyc.rejectedAt = new Date();
    kyc.rejectedBy = req.user._id;
    kyc.rejectionReason = String(reason || "").trim();
    kyc.approvedAt = null;
    kyc.approvedBy = null;
    await kyc.save();

    res.status(200).json({
      message: "Application rejected. Intern must re-upload documents and resubmit for verification.",
      approvalStatus: "rejected",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const approveInternCertificate = async (req, res) => {
  try {
    const user = await findInternUser(req.params.id, res);
    if (!user) return;

    const internshipSlug = await resolveInternshipSlugForUser(user._id, req.body?.internshipSlug);
    if (!internshipSlug) {
      return res.status(400).json({ message: "Intern is not enrolled in a program" });
    }

    const kyc = await findKycForProgram(user._id, internshipSlug);
    if (!kyc || (kyc.approvalStatus || "pending") !== "approved") {
      return res.status(400).json({ message: "Intern must be approved for this program before certificate can be issued" });
    }

    const enrollment = await UserInternship.findOne({ userId: user._id, internshipSlug });
    if (!enrollment) {
      return res.status(400).json({ message: "Intern is not enrolled in this program" });
    }

    const program = getInternshipBySlug(enrollment.internshipSlug);
    if (!program) {
      return res.status(400).json({ message: "Invalid internship program" });
    }

    const certificateTemplateId = req.body?.certificateTemplateId;
    if (!certificateTemplateId) {
      return res.status(400).json({ message: "Certificate template is required" });
    }

    const certificateTemplate = await CertificateTemplate.findOne({
      _id: certificateTemplateId,
      active: true,
      type: { $in: await getIssuableCertificateTypeSlugs() },
    });
    if (!certificateTemplate) {
      return res.status(400).json({ message: "Valid active certificate template is required" });
    }

    if (requiresCompletionLock(certificateTemplate.type)) {
      const certificateEligibleAt = getCertificateEligibleAt(
        getCertificateLockStartDate(kyc, enrollment)
      );
      if (!isCertificateUnlocked(certificateEligibleAt)) {
        const daysLeft = getCertificateLockDaysRemaining(certificateEligibleAt);
        return res.status(400).json({
          message: `Completion certificate issue is locked for ${CERTIFICATE_ISSUE_LOCK_DAYS} days after approval. ${daysLeft} day(s) remaining.`,
          certificateEligibleAt,
          certificateLockDaysRemaining: daysLeft,
        });
      }
    }

    const studentName = (req.body?.studentName || kyc.fullName || `${user.firstName} ${user.lastName}`).trim();
    if (!studentName) {
      return res.status(400).json({ message: "Student name is required" });
    }

    const existing = await InternshipCertificate.findOne({
      userId: user._id,
      internshipSlug: enrollment.internshipSlug,
      certificateTemplateId: certificateTemplate._id,
    });
    if (existing) {
      return res.status(400).json({
        message: `${certificateTemplate.label} certificate is already issued for this intern`,
        certificate: {
          id: existing._id,
          uuid: existing.uuid,
          studentName: existing.studentName,
          programTitle: existing.programTitle,
          templateLabel: certificateTemplate.label,
          issuedAt: existing.createdAt,
        },
      });
    }

    const certificate = await InternshipCertificate.create({
      userId: user._id,
      internshipSlug: enrollment.internshipSlug,
      programTitle: resolveProgramTitle(enrollment.internshipSlug, {
        enrollmentTitle: enrollment.title,
        storedTitle: program?.title,
      }),
      studentName,
      uuid: await generateUniqueCertificateId("internship"),
      certificateTemplateId: certificateTemplate._id,
      certificateType: certificateTemplate.type,
      issuedBy: req.user._id,
    });

    res.status(200).json({
      message: `${certificateTemplate.label} certificate issued and available in intern portal`,
      certificate: {
        id: certificate._id,
        uuid: certificate.uuid,
        studentName: certificate.studentName,
        programTitle: certificate.programTitle,
        templateLabel: certificateTemplate.label,
        certificateType: certificate.certificateType,
        issuedAt: certificate.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    if (err?.code === 11000) {
      return res.status(400).json({
        message:
          "A certificate for this intern and program already exists. If you are issuing a different template, restart the backend so certificate indexes can migrate.",
      });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
};

const mapCertificateTemplate = (row) => ({
  id: row._id,
  type: row.type,
  label: row.label,
  pdfUrl: row.pdfUrl,
  description: row.description || "",
  active: row.active,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

async function ensureDefaultCertificateTemplates() {
  const count = await CertificateTemplate.countDocuments();
  if (count > 0) return;
  await CertificateTemplate.insertMany(DEFAULT_CERTIFICATE_TEMPLATES);
}

const listCertificateTypesHandler = async (req, res) => {
  try {
    const { kind } = req.query;
    const types = await listCertificateTypes({
      kind: kind || undefined,
      activeOnly: req.query.includeInactive === "true" ? false : true,
    });
    res.status(200).json({ types });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createCertificateTypeHandler = async (req, res) => {
  try {
    const type = await createCertificateType(req.body, req.user._id);
    res.status(201).json({
      message: "Certificate type created",
      type,
    });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Something went wrong" });
  }
};

const updateCertificateTypeHandler = async (req, res) => {
  try {
    const type = await updateCertificateType(req.params.id, req.body);
    res.status(200).json({
      message: "Certificate type updated",
      type,
    });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Something went wrong" });
  }
};

const deleteCertificateTypeHandler = async (req, res) => {
  try {
    const type = await deleteCertificateType(req.params.id, { CertificateTemplate });
    res.status(200).json({
      message: "Certificate type deleted",
      type,
    });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Something went wrong" });
  }
};

const listCertificateTemplates = async (req, res) => {
  try {
    await ensureDefaultCertificateTemplates();
    const { type, issuable } = req.query;
    const filter = {};
    if (type) {
      filter.type = normalizeTypeSlug(type);
    } else if (issuable === "true") {
      filter.type = { $in: await getIssuableCertificateTypeSlugs() };
    }
    const [templates, types] = await Promise.all([
      CertificateTemplate.find(filter).sort({ type: 1, label: 1 }),
      listCertificateTypes({ activeOnly: true }),
    ]);
    res.status(200).json({
      templates: templates.map(mapCertificateTemplate),
      types: types.map((row) => row.slug),
      typeRows: types,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createCertificateTemplate = async (req, res) => {
  try {
    const { type, label, pdfUrl, description, active } = req.body;
    if (!type) {
      return res.status(400).json({ message: "Valid certificate type is required" });
    }
    await assertCertificateTypeExists(type);
    if (!label?.trim() || !pdfUrl?.trim()) {
      return res.status(400).json({ message: "Label and PDF URL are required" });
    }

    const template = await CertificateTemplate.create({
      type: normalizeTypeSlug(type),
      label: label.trim(),
      pdfUrl: pdfUrl.trim(),
      description: description?.trim() || "",
      active: active !== false,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Certificate template created",
      template: mapCertificateTemplate(template),
    });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ message: err.message || "Something went wrong" });
  }
};

const updateCertificateTemplate = async (req, res) => {
  try {
    const { type, label, pdfUrl, description, active } = req.body;
    const template = await CertificateTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (type !== undefined) {
      await assertCertificateTypeExists(type);
      template.type = normalizeTypeSlug(type);
    }
    const previousPdfUrl = template.pdfUrl;
    if (label !== undefined) template.label = label.trim();
    if (pdfUrl !== undefined) template.pdfUrl = pdfUrl.trim();
    if (description !== undefined) template.description = description.trim();
    if (active !== undefined) template.active = Boolean(active);

    await template.save();

    if (
      pdfUrl !== undefined &&
      previousPdfUrl &&
      previousPdfUrl !== template.pdfUrl
    ) {
      const remainingWithSameFile = await CertificateTemplate.countDocuments({ pdfUrl: previousPdfUrl });
      if (remainingWithSameFile === 0) {
        await deleteStoredFile(previousPdfUrl);
      }
    }

    res.status(200).json({
      message: "Certificate template updated",
      template: mapCertificateTemplate(template),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteCertificateTemplate = async (req, res) => {
  try {
    const template = await CertificateTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const pdfUrl = template.pdfUrl;
    await template.deleteOne();

    const remainingWithSameFile = pdfUrl
      ? await CertificateTemplate.countDocuments({ pdfUrl })
      : 0;
    if (pdfUrl && remainingWithSameFile === 0) {
      await deleteStoredFile(pdfUrl);
    }

    res.status(200).json({ message: "Certificate template and PDF deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const uploadCertificateTemplatePdfFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a PDF file" });
    }
    const pdfUrl = getPublicFileUrl(req, req.file);
    res.status(200).json({ message: "PDF uploaded", pdfUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload PDF" });
  }
};

const listCertificates = async (req, res) => {
  try {
    const { type } = req.query;
    const includeInternship = !type || type === "internship-completion" || type === "all";
    const includeCourse = !type || type === "course-completion" || type === "all";

    let internshipCertificates = [];
    let courseCertificates = [];

    if (includeInternship) {
      const certificates = await InternshipCertificate.find({})
        .populate("userId", "firstName lastName email")
        .populate("issuedBy", "firstName lastName email")
        .sort({ createdAt: -1 });

      internshipCertificates = certificates.map((c) => ({
        id: c._id,
        recordType: "internship-completion",
        uuid: c.uuid,
        studentName: c.studentName,
        programTitle: c.programTitle,
        internshipSlug: c.internshipSlug,
        issuedAt: c.createdAt,
        student: c.userId
          ? {
              id: c.userId._id,
              email: c.userId.email,
              name: `${c.userId.firstName || ""} ${c.userId.lastName || ""}`.trim(),
            }
          : null,
        issuedBy: c.issuedBy
          ? {
              email: c.issuedBy.email,
              name: `${c.issuedBy.firstName || ""} ${c.issuedBy.lastName || ""}`.trim(),
            }
          : null,
      }));
    }

    if (includeCourse) {
      const courseRows = await CourseCertificate.find({})
        .populate("userId", "firstName lastName email")
        .populate("courseId", "courseTitle")
        .sort({ createdAt: -1 });

      courseCertificates = courseRows.map((c) => ({
        id: c._id,
        recordType: "course-completion",
        uuid: c.uuid,
        studentName: c.userId
          ? `${c.userId.firstName || ""} ${c.userId.lastName || ""}`.trim() || c.userId.email
          : "—",
        programTitle: c.courseId?.courseTitle || "Course",
        courseId: c.courseId?._id || null,
        issuedAt: c.createdAt,
        student: c.userId
          ? {
              id: c.userId._id,
              email: c.userId.email,
              name: `${c.userId.firstName || ""} ${c.userId.lastName || ""}`.trim(),
            }
          : null,
        issuedBy: null,
      }));
    }

    res.status(200).json({
      certificates: [...internshipCertificates, ...courseCertificates].sort(
        (a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)
      ),
      internshipCertificates,
      courseCertificates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteIssuedCertificate = async (req, res) => {
  try {
    const { recordType } = req.query;
    if (recordType === "course-completion") {
      const deleted = await CourseCertificate.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Certificate not found" });
      return res.status(200).json({ message: "Course certificate deleted" });
    }

    const deleted = await InternshipCertificate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Certificate not found" });
    res.status(200).json({ message: "Internship certificate deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const previewCertificateTemplate = async (req, res) => {
  try {
    const template = await CertificateTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const sampleName = "Sample Student Name";
    const sampleProgram = "Sample Program Title";
    const sampleUuid = "EDL-CRT-2026-PREVIEWS";

    const sampleTo = new Date();
    const sampleFrom = new Date(sampleTo);
    sampleFrom.setMonth(sampleFrom.getMonth() - 2);

    let pdfBytes;
    if (isOfferLetterTemplate(template)) {
      pdfBytes = await buildOfferLetterPdf({
        pdfUrl: template.pdfUrl,
        candidateName: sampleName,
        issuedAt: sampleTo,
        templateLabel: template.label,
        programTitle: "Lead Generation Internship",
        programDomain: "Lead Generation",
        roleDescription:
          "The intern will assist in identifying and generating potential leads, team leading, maintaining lead databases, conducting market research, qualifying prospects, coordinating with different departments, attending meetings, and performing other lead generation-related tasks assigned by the reporting manager.",
      });
    } else {
      pdfBytes = await buildInternshipCompletionPdf({
        pdfUrl: template.pdfUrl,
        templateLabel: template.label,
        studentName: sampleName,
        programTitle: sampleProgram,
        uuid: sampleUuid,
        issuedAt: sampleTo,
        fromDate: sampleFrom,
        toDate: sampleTo,
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${template.label.replace(/\s+/g, "_")}_preview.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("previewCertificateTemplate error:", err);
    res.status(500).json({ message: "Failed to generate template preview" });
  }
};

const previewIssuedCertificate = async (req, res) => {
  try {
    const { recordType } = req.query;

    if (recordType === "course-completion") {
      const certificate = await CourseCertificate.findById(req.params.id)
        .populate("userId", "firstName lastName email")
        .populate("courseId", "courseTitle");
      if (!certificate) {
        return res.status(404).json({ message: "Certificate not found" });
      }

      const studentName =
        `${certificate.userId?.firstName || ""} ${certificate.userId?.lastName || ""}`.trim() ||
        certificate.userId?.email ||
        "Student";
      const programTitle = certificate.courseId?.courseTitle || "Course";

      let template = await CertificateTemplate.findOne({
        type: "course-completion",
        active: true,
      }).sort({ updatedAt: -1 });
      if (!template) {
        await ensureDefaultCertificateTemplates();
        template = await CertificateTemplate.findOne({ type: "course-completion", active: true });
      }
      if (!template) {
        return res.status(404).json({ message: "No active course certificate template" });
      }

      const pdfBytes = await buildInternshipCompletionPdf({
        pdfUrl: template.pdfUrl,
        templateLabel: template.label,
        studentName,
        programTitle,
        uuid: certificate.uuid,
        issuedAt: certificate.createdAt,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${studentName.replace(/\s+/g, "_")}_course_certificate.pdf"`
      );
      return res.send(Buffer.from(pdfBytes));
    }

    const certificate = await InternshipCertificate.findById(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    let template = await resolveCertificateTemplateForProgram(
      certificate.internshipSlug,
      certificate.certificateTemplateId
    );
    if (!template?.pdfUrl) {
      await ensureDefaultCertificateTemplates();
      template = await resolveCertificateTemplateForProgram(
        certificate.internshipSlug,
        certificate.certificateTemplateId
      );
    }
    if (!template) {
      return res.status(404).json({ message: "No active internship certificate template" });
    }

    const { fromDate, toDate } = await resolveInternshipCertificateDates(certificate);
    const enrollment = await UserInternship.findOne({
      userId: certificate.userId,
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
      issuedAt: certificate.createdAt,
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
    console.error("previewIssuedCertificate error:", err);
    res.status(500).json({ message: "Failed to generate certificate preview" });
  }
};

const getTransactionSource = (row) => {
  if (row.internshipSlug) return "internship";
  if (row.subscribedAllCourse) return "membership";
  return "course";
};

const parseAmount = (value) => {
  const n = parseFloat(String(value ?? "0").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const buildDateRangeQuery = ({ date, month, year }) => {
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    return { timestamp: { $gte: startDate, $lt: endDate } };
  }
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    return { timestamp: { $gte: new Date(y, m - 1, 1), $lt: new Date(y, m, 1) } };
  }
  if (year && /^\d{4}$/.test(year)) {
    const y = Number(year);
    return { timestamp: { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) } };
  }
  return {};
};

const buildBreakdownDateQuery = ({ year }) => {
  if (year && /^\d{4}$/.test(year)) {
    const y = Number(year);
    return { timestamp: { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) } };
  }
  return {};
};

const monthLabel = (year, month) =>
  new Date(year, month - 1, 1).toLocaleDateString("en-IN", { month: "short", year: "numeric" });

const emptySourceBucket = () => ({ total: 0, count: 0 });

const listTransactions = async (req, res) => {
  try {
    const { date, month, year, source, search } = req.query;
    const term = search?.trim().toLowerCase() || "";
    const sourceFilter = ["internship", "course", "membership"].includes(source) ? source : null;

    const mapTransactionRow = (t) => {
      const user = t.userId;
      if (!user || typeof user !== "object") return null;
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const rowSource = getTransactionSource(t);
      return {
        id: String(t._id),
        name: name || user.email || "—",
        email: user.email || "",
        phoneNumber: user.phone || "",
        paymentId: t.paymentId || "—",
        amount: t.amount || "0",
        date: t.timestamp || t.createdAt,
        internshipSlug: t.internshipSlug || null,
        subscribedAllCourse: Boolean(t.subscribedAllCourse),
        source: rowSource,
      };
    };

    const matchesSearch = (row) => {
      if (!term) return true;
      return (
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.paymentId.toLowerCase().includes(term)
      );
    };

    const matchesSource = (rowSource) => !sourceFilter || rowSource === sourceFilter;

    const listQuery = buildDateRangeQuery({ date, month, year });

    const transactions = await Transaction.find(listQuery)
      .populate("userId", "firstName lastName email phone")
      .sort({ timestamp: -1 })
      .limit(1000)
      .lean();

    let rows = transactions
      .map(mapTransactionRow)
      .filter(Boolean)
      .filter((row) => matchesSource(row.source))
      .filter(matchesSearch);

    if (date && rows.length === 0) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      const userCourses = await UserCourse.find({
        createdAt: { $gte: startDate, $lt: endDate },
        paid: true,
      })
        .populate("userId", "firstName lastName email phone")
        .populate("transactionId")
        .lean();

      rows = userCourses
        .filter((uc) => uc.userId && uc.transactionId)
        .map((uc) =>
          mapTransactionRow({
            _id: uc.transactionId._id,
            userId: uc.userId,
            paymentId: uc.transactionId.paymentId,
            amount: uc.transactionId.amount,
            timestamp: uc.transactionId.timestamp,
            internshipSlug: uc.transactionId.internshipSlug,
            subscribedAllCourse: uc.transactionId.subscribedAllCourse,
          })
        )
        .filter(Boolean)
        .filter((row) => matchesSource(row.source))
        .filter(matchesSearch);
    }

    const breakdownQuery = buildBreakdownDateQuery({ year });
    const breakdownRows = await Transaction.find(breakdownQuery)
      .select("amount timestamp internshipSlug subscribedAllCourse")
      .sort({ timestamp: -1 })
      .lean();

    const monthMap = new Map();
    for (const t of breakdownRows) {
      const ts = t.timestamp ? new Date(t.timestamp) : null;
      if (!ts || Number.isNaN(ts.getTime())) continue;
      const rowSource = getTransactionSource(t);
      if (sourceFilter && rowSource !== sourceFilter) continue;

      const y = ts.getFullYear();
      const m = ts.getMonth() + 1;
      const key = `${y}-${String(m).padStart(2, "0")}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, {
          key,
          label: monthLabel(y, m),
          year: y,
          month: m,
          total: 0,
          count: 0,
          bySource: {
            internship: emptySourceBucket(),
            course: emptySourceBucket(),
            membership: emptySourceBucket(),
          },
        });
      }
      const bucket = monthMap.get(key);
      const amount = parseAmount(t.amount);
      bucket.total += amount;
      bucket.count += 1;
      bucket.bySource[rowSource].total += amount;
      bucket.bySource[rowSource].count += 1;
    }

    const monthlyBreakdown = Array.from(monthMap.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    const availableYears = [...new Set(monthlyBreakdown.map((row) => row.year))].sort((a, b) => b - a);

    const summaryTotal = rows.reduce((sum, row) => sum + parseAmount(row.amount), 0);
    const breakdownGrandTotal = monthlyBreakdown.reduce((sum, row) => sum + row.total, 0);
    const breakdownGrandCount = monthlyBreakdown.reduce((sum, row) => sum + row.count, 0);

    res.status(200).json({
      transactions: rows,
      summary: {
        totalRevenue: summaryTotal,
        transactionCount: rows.length,
        breakdownRevenue: breakdownGrandTotal,
        breakdownCount: breakdownGrandCount,
        filter: {
          date: date || null,
          month: month || null,
          year: year || null,
          source: sourceFilter || "all",
          search: term || null,
        },
      },
      monthlyBreakdown,
      availableYears,
    });
  } catch (err) {
    console.error("listTransactions error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const listInvites = async (req, res) => {
  try {
    const invites = await InternInvite.find({})
      .populate("invitedBy", "firstName lastName email")
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(200);

    const userIds = invites
      .map((row) => row.userId?._id || row.userId)
      .filter(Boolean);
    const kycRecords = await InternKyc.find({ userId: { $in: userIds } });

    res.status(200).json({
      invites: invites.map((row) => {
        const program = getInternshipBySlug(row.internshipSlug);
        const userKey = row.userId ? String(row.userId._id || row.userId) : null;
        const kyc = pickKycFromList(kycRecords, userKey, row.internshipSlug, row._id);
        return {
          id: row._id,
          email: row.email,
          firstName: row.firstName,
          lastName: row.lastName,
          internshipSlug: row.internshipSlug,
          programTitle: program?.title || row.internshipSlug,
          status: row.status,
          token: row.token,
          inviteUrl: buildInviteUrl(row.token),
          expiresAt: row.expiresAt,
          acceptedAt: row.acceptedAt,
          inviteMessage: row.inviteMessage,
          password: row.status === "accepted" ? row.onboardingPassword : null,
          onboardingPassword: row.status === "accepted" ? row.onboardingPassword : null,
          approvalStatus: kyc?.approvalStatus || (row.status === "accepted" ? "pending" : null),
          kyc: mapKycSummary(kyc, req.userRole),
          invitedBy: row.invitedBy
            ? {
                name: `${row.invitedBy.firstName || ""} ${row.invitedBy.lastName || ""}`.trim(),
                email: row.invitedBy.email,
              }
            : null,
          user: row.userId
            ? {
                id: row.userId._id,
                name: `${row.userId.firstName || ""} ${row.userId.lastName || ""}`.trim(),
                email: row.userId.email,
              }
            : null,
          createdAt: row.createdAt,
        };
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createInvite = async (req, res) => {
  try {
    const { email, firstName, lastName, internshipSlug, inviteMessage } = req.body;
    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    const slug = internshipSlug || "sales-marketing";
    const program = getInternshipBySlug(slug);
    if (!program) {
      return res.status(400).json({ message: "Invalid internship program" });
    }
    if (program.track !== "careers") {
      return res.status(400).json({ message: "Invites are only for careers internships" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!isGmailAddress(normalizedEmail)) {
      return res.status(400).json({ message: "Only Gmail addresses are allowed for intern invites" });
    }
    const existingPending = await InternInvite.findOne({
      email: normalizedEmail,
      internshipSlug: slug,
      status: "pending",
      expiresAt: { $gt: new Date() },
    });
    if (existingPending) {
      return res.status(400).json({ message: "A pending invite already exists for this email" });
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const invite = await InternInvite.create({
      email: normalizedEmail,
      firstName: firstName?.trim() || "",
      lastName: lastName?.trim() || "",
      internshipSlug: slug,
      token,
      invitedBy: req.user._id,
      expiresAt,
      inviteMessage: inviteMessage?.trim() || "",
    });

    const inviteUrl = buildInviteUrl(token);
    const html = inviteEmailHtml({
      firstName: invite.firstName,
      inviteUrl,
      message: invite.inviteMessage,
      programTitle: program.title,
    });

    await sendEmail.sendEmail(
      `EdLernity Internship Invite — ${program.title}`,
      normalizedEmail,
      html,
      `Complete onboarding: ${inviteUrl}`
    );

    res.status(201).json({
      message: "Invite sent successfully",
      invite: {
        id: invite._id,
        email: invite.email,
        inviteUrl,
        expiresAt: invite.expiresAt,
        programTitle: program.title,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const recordOfferLetter = async (req, res) => {
  try {
    const { userEmail, internshipSlug, candidateName, templateId, templateLabel } = req.body;
    if (!userEmail || !internshipSlug || !candidateName?.trim()) {
      return res.status(400).json({ message: "userEmail, internshipSlug, and candidateName are required" });
    }

    const program = getInternshipBySlug(internshipSlug);
    if (!program || program.track !== "careers") {
      return res.status(400).json({ message: "Offer letters are only for careers internships" });
    }

    const user = await UserModel.findOne({ email: userEmail.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const templateMeta = await resolveOfferLetterForProgram(internshipSlug);

    const record = await IssuedOfferLetter.create({
      userId: user._id,
      internshipSlug,
      candidateName: candidateName.trim(),
      templateId: templateId || templateMeta.templateId,
      templateLabel: templateLabel || templateMeta.templateLabel,
      offerLetterTemplateId: templateMeta.offerLetterTemplateId,
      issuedBy: req.user._id,
      emailSent: true,
    });

    res.status(201).json({
      message: "Offer letter recorded",
      offerLetter: {
        id: record._id,
        userId: user._id,
        internshipSlug,
        candidateName: record.candidateName,
        issuedAt: record.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const listIssuedOfferLetters = async (req, res) => {
  try {
    const letters = await IssuedOfferLetter.find({})
      .populate("userId", "firstName lastName email")
      .populate("issuedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(200);

    res.status(200).json({
      offerLetters: letters.map((row) => ({
        id: row._id,
        candidateName: row.candidateName,
        internshipSlug: row.internshipSlug,
        templateLabel: row.templateLabel,
        issuedAt: row.createdAt,
        user: row.userId
          ? {
              email: row.userId.email,
              name: `${row.userId.firstName || ""} ${row.userId.lastName || ""}`.trim(),
            }
          : null,
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

const deleteInvite = async (req, res) => {
  try {
    const invite = await InternInvite.findById(req.params.id);
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    const kycQuery = invite.userId
      ? { $or: [{ inviteId: invite._id }, { userId: invite.userId }] }
      : { inviteId: invite._id };
    const kycRecords = await InternKyc.find(kycQuery);
    const kycFileUrls = kycRecords.flatMap((row) => collectKycFileUrls(row));

    await InternKyc.deleteMany({ _id: { $in: kycRecords.map((row) => row._id) } });
    await invite.deleteOne();
    await deleteStoredFiles(kycFileUrls);

    res.status(200).json({ message: "Invite and related documents deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }
    if (["admin", "manager"].includes(user.role)) {
      return res.status(400).json({ message: "Admin and manager accounts cannot be deleted from CRM" });
    }

    const kycRecords = await InternKyc.find({ userId: user._id });
    const kycFileUrls = kycRecords.flatMap((row) => collectKycFileUrls(row));

    await Promise.all([
      UserInternship.deleteMany({ userId: user._id }),
      InternInvite.updateMany({ userId: user._id }, { $set: { userId: null } }),
      UserCourse.deleteMany({ userId: user._id }),
      InternshipCertificate.deleteMany({ userId: user._id }),
      IssuedOfferLetter.deleteMany({ userId: user._id }),
      InternKyc.deleteMany({ userId: user._id }),
    ]);

    await deleteStoredFiles(kycFileUrls);
    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getOverview,
  listUsers,
  updateUserRole,
  updateUserBlock,
  getInterns,
  blockInternProfile,
  deleteInternProfile,
  approveInternKyc,
  rejectInternKyc,
  approveInternCertificate,
  listCertificateTypes: listCertificateTypesHandler,
  createCertificateType: createCertificateTypeHandler,
  updateCertificateType: updateCertificateTypeHandler,
  deleteCertificateType: deleteCertificateTypeHandler,
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
  deleteInvite,
  deleteUser,
  recordOfferLetter,
  listIssuedOfferLetters,
};
