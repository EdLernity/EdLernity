const UserModel = require("../models/userModel");
const UserInternship = require("../models/userInternshipSchema");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const InternshipStudentAssignment = require("../models/internshipStudentAssignmentSchema");
const Transaction = require("../models/transactionSchema");
const UserCourse = require("../models/userCourseSchema");
const CourseModel = require("../models/courseModel");
const {
  grantSingleCourseAccess,
  grantAllCoursesAccess,
  revokeSingleCourseAccess,
  revokeAllCourseAccess,
} = require("../utils/userCourseUtils");
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
const { getInternshipBySlug, resolveProgramTitle, isTechInternshipProgram } = require("../utils/internshipCatalog");
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
    approvalStatus: kyc.approvalStatus || "pending",
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

function resolveCertificateType(row, templateMap) {
  const template = row.certificateTemplateId
    ? templateMap.get(String(row.certificateTemplateId))
    : null;
  return String(row.certificateType || template?.type || "").trim();
}

function resolveCertificateTemplateLabel(row, templateMap) {
  const template = row.certificateTemplateId
    ? templateMap.get(String(row.certificateTemplateId))
    : null;
  return String(template?.label || "").trim();
}

/** True for internship completion PDFs (Tech / Non Tech), not recognition/offer letters. */
function isInternshipCompletionCertificate(row, templateMap) {
  const type = resolveCertificateType(row, templateMap);
  if (type === "course-completion" || type.startsWith("offer-letter")) return false;
  if (type === "internship-completion") return true;

  const label = resolveCertificateTemplateLabel(row, templateMap);
  if (/tech\s*internship|non[\s-]*tech|internship\s*completion/i.test(label)) return true;

  // Manager-issued completion certs store an internship period (from/to).
  if (row.fromDate && row.toDate) {
    if (/appreciation|participation|best\s*performer|recognition/i.test(label)) return false;
    return true;
  }

  return false;
}

function mapIssuedCertificate(row, templateMap) {
  const template = row.certificateTemplateId
    ? templateMap.get(String(row.certificateTemplateId))
    : null;
  const certificateType = resolveCertificateType(row, templateMap) || "other";
  return {
    id: row._id,
    uuid: row.uuid,
    studentName: row.studentName,
    programTitle: row.programTitle,
    templateId: row.certificateTemplateId ? String(row.certificateTemplateId) : null,
    templateLabel: template?.label || "Internship Certificate",
    certificateType,
    issuedAt: row.issuedAt || row.toDate || row.createdAt,
    fromDate: row.fromDate || null,
    toDate: row.toDate || row.issuedAt || row.createdAt || null,
  };
}

function parseManualIssuedAt(value) {
  const raw = String(value || "").trim();
  if (!raw) return null;
  // YYYY-MM-DD → local noon so timezone does not shift the printed day
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split("-").map(Number);
    const date = new Date(y, m - 1, d, 12, 0, 0);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildCertificateMeta(programCertificates, kyc, enrollment, trainerProgress = null) {
  const lockStart = getCertificateLockStartDate(kyc, enrollment);
  const certificateEligibleAt = getCertificateEligibleAt(lockStart);
  const courseCompletionUnlocked = isCertificateUnlocked(certificateEligibleAt);
  const internshipCompleted = Boolean(trainerProgress?.internshipCompleted);
  // Count Tech / Non Tech / internship-completion (not recognition certificates).
  const hasInternshipCompletionCert = programCertificates.some((c) => {
    if (c.certificateType === "internship-completion") return true;
    const label = String(c.templateLabel || "");
    if (/tech\s*internship|non[\s-]*tech|internship\s*completion/i.test(label)) return true;
    if (c.fromDate && c.toDate) {
      return !/appreciation|participation|best\s*performer|recognition/i.test(label);
    }
    return false;
  });
  const awaitingInternshipCertificate =
    internshipCompleted && !hasInternshipCompletionCert;
  // Internship completion unlocks when trainer marks complete; other completion types use 60-day lock.
  const certificateUnlocked = internshipCompleted || courseCompletionUnlocked;
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
    courseCompletionUnlocked,
    certificateLockDaysRemaining: getCertificateLockDaysRemaining(certificateEligibleAt),
    certificateLockDays: CERTIFICATE_ISSUE_LOCK_DAYS,
    internshipCompleted,
    internshipCompletedAt: trainerProgress?.internshipCompletedAt || null,
    internshipCompletedOverride: Boolean(trainerProgress?.internshipCompletedOverride),
    awaitingInternshipCertificate,
  };
}

function effectiveCertificateIssuedAt(row) {
  return row?.issuedAt || row?.createdAt || null;
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

/**
 * Manager dashboard: intern pipeline counts (KYC, tech/non-tech certificates, invites).
 */
const getManagerDashboard = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      roleInternCount,
      kycPending,
      kycApproved,
      kycRejected,
      pendingInvites,
      offerLettersIssued,
      certificatesThisMonth,
      kycUserIds,
      inviteUserIds,
      enrollments,
      trainerCompleted,
      certificates,
      certificateTemplates,
      approvedKycRows,
      recentPendingKyc,
    ] = await Promise.all([
      UserModel.countDocuments({ role: "intern", isActive: { $ne: false } }),
      InternKyc.countDocuments({ approvalStatus: "pending" }),
      InternKyc.countDocuments({ approvalStatus: "approved" }),
      InternKyc.countDocuments({ approvalStatus: "rejected" }),
      InternInvite.countDocuments({ status: "pending" }),
      IssuedOfferLetter.countDocuments({}),
      InternshipCertificate.countDocuments({ createdAt: { $gte: startOfMonth } }),
      InternKyc.distinct("userId"),
      UserInternship.distinct("userId", { enrollmentSource: "invite" }),
      UserInternship.find({ active: { $ne: false } })
        .select("userId internshipSlug title")
        .lean(),
      InternshipStudentAssignment.find({
        internshipCompleted: true,
        active: { $ne: false },
      })
        .select("studentId internshipSlug")
        .lean(),
      InternshipCertificate.find({})
        .select("userId internshipSlug certificateType certificateTemplateId fromDate toDate")
        .lean(),
      CertificateTemplate.find({}).select("_id label type").lean(),
      InternKyc.find({ approvalStatus: "approved" }).select("userId internshipSlug").lean(),
      InternKyc.find({ approvalStatus: "pending" })
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("userId", "firstName lastName email")
        .lean(),
    ]);

    const profileUserIds = new Set([
      ...kycUserIds.map((id) => String(id)),
      ...inviteUserIds.map((id) => String(id)),
    ]);
    const extraActive = profileUserIds.size
      ? await UserModel.countDocuments({
          _id: { $in: [...profileUserIds] },
          role: { $ne: "intern" },
          isActive: { $ne: false },
        })
      : 0;
    const totalInterns = roleInternCount + extraActive;

    const templateMap = new Map(certificateTemplates.map((row) => [String(row._id), row]));
    const certKey = (userId, slug) => `${String(userId)}:${slug}`;
    const hasCompletion = new Set();
    for (const cert of certificates) {
      if (isInternshipCompletionCertificate(cert, templateMap)) {
        hasCompletion.add(certKey(cert.userId, cert.internshipSlug));
      }
    }

    const trainerCompleteKeys = new Set(
      trainerCompleted.map((row) => certKey(row.studentId, row.internshipSlug))
    );

    const approvedExact = new Set();
    const usersWithLegacyApproved = new Set();
    for (const row of approvedKycRows) {
      const uid = String(row.userId);
      if (!row.internshipSlug) {
        usersWithLegacyApproved.add(uid);
      } else {
        approvedExact.add(certKey(uid, row.internshipSlug));
      }
    }

    let techAwaitingCertificate = 0;
    let businessAwaitingCertificate = 0;
    let readyAfterTrainer = 0;
    const seenEnrollment = new Set();

    for (const enrollment of enrollments) {
      const uid = String(enrollment.userId);
      const slug = enrollment.internshipSlug;
      const key = certKey(uid, slug);
      if (seenEnrollment.has(key)) continue;
      seenEnrollment.add(key);
      if (hasCompletion.has(key)) continue;

      const hasApprovedKyc = approvedExact.has(key) || usersWithLegacyApproved.has(uid);
      const trainerDone = trainerCompleteKeys.has(key);
      if (!trainerDone && !hasApprovedKyc) continue;

      if (trainerDone) readyAfterTrainer += 1;
      if (isTechInternshipProgram(slug, enrollment.title || "")) {
        techAwaitingCertificate += 1;
      } else {
        businessAwaitingCertificate += 1;
      }
    }

    const recentPending = recentPendingKyc.map((row) => {
      const user = row.userId;
      return {
        id: String(row._id),
        studentId: user?._id ? String(user._id) : String(row.userId),
        name: row.fullName || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "—",
        email: row.email || user?.email || "",
        program: row.internshipSlug || "",
        submittedAt: row.createdAt,
      };
    });

    res.status(200).json({
      stats: {
        totalInterns,
        kycPending,
        kycApproved,
        kycRejected,
        techAwaitingCertificate,
        businessAwaitingCertificate,
        readyAfterTrainer,
        pendingInvites,
        offerLettersIssued,
        certificatesThisMonth,
      },
      recentPendingApprovals: recentPending,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load manager dashboard" });
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
    const includeInactive = String(req.query.includeInactive || "") === "true";
    const internQuery = { role: "intern" };
    if (!includeInactive) {
      internQuery.isActive = { $ne: false };
    }

    // Also surface accounts that completed intern KYC / invite enrollment even if
    // role is not "intern" (e.g. manager email reused for onboarding).
    const [kycUserIds, inviteUserIds] = await Promise.all([
      InternKyc.distinct("userId"),
      UserInternship.distinct("userId", { enrollmentSource: "invite" }),
    ]);
    const extraUserIds = [
      ...new Set(
        [...kycUserIds, ...inviteUserIds].map((id) => String(id)).filter(Boolean)
      ),
    ];

    const orFilters = [internQuery];
    if (extraUserIds.length) {
      const extraQuery = { _id: { $in: extraUserIds } };
      if (!includeInactive) {
        extraQuery.isActive = { $ne: false };
      }
      orFilters.push(extraQuery);
    }

    const internUsers = await UserModel.find({ $or: orFilters })
      .select("firstName lastName email phone role IsBlocked isActive createdAt")
      .sort({ createdAt: -1 });

    const userIds = internUsers.map((user) => user._id);

    const issuableTypeSlugs = await getIssuableCertificateTypeSlugs();
    const enrollmentQuery = { userId: { $in: userIds } };
    if (!includeInactive) {
      enrollmentQuery.active = { $ne: false };
    }

    const [kycRecords, enrollments, certificates, certificateTemplates, trainerAssignments] =
      await Promise.all([
        InternKyc.find({ userId: { $in: userIds } }),
        UserInternship.find(enrollmentQuery).sort({ createdAt: -1 }),
        InternshipCertificate.find({ userId: { $in: userIds } }),
        CertificateTemplate.find({
          type: { $in: issuableTypeSlugs },
          active: true,
        }).select("_id label type"),
        InternshipStudentAssignment.find({
          studentId: { $in: userIds },
          active: { $ne: false },
        })
          .select(
            "studentId internshipSlug internshipCompleted internshipCompletedAt internshipCompletedOverride"
          )
          .lean(),
      ]);

    const templateMap = new Map(certificateTemplates.map((row) => [String(row._id), row]));

    const trainerByKey = new Map();
    for (const row of trainerAssignments) {
      trainerByKey.set(`${row.studentId}:${row.internshipSlug}`, row);
    }

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
      const isActive = user.isActive !== false;

      if (!userEnrollments.length) {
        if (!includeInactive && !isActive) continue;
        const kyc = kycRecords.find((row) => String(row.userId) === userKey) || null;
        const programCertificates = certificates
          .filter((row) => String(row.userId) === userKey)
          .map((row) => mapIssuedCertificate(row, templateMap));
        const certificateMeta = buildCertificateMeta(programCertificates, kyc, null, null);
        interns.push({
          id: userKey,
          student: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || kyc?.phone || "",
            isBlocked: user.IsBlocked,
            isActive,
            joinedAt: user.createdAt,
          },
          kyc: mapKycSummary(kyc, req.userRole),
          enrollment: null,
          ...certificateMeta,
        });
        continue;
      }

      for (const enrollment of userEnrollments) {
        const enrollmentActive = enrollment.active !== false;
        if (!includeInactive && !enrollmentActive) continue;

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
        const trainerProgress =
          trainerByKey.get(`${userKey}:${enrollment.internshipSlug}`) || null;
        const certificateMeta = buildCertificateMeta(
          programCertificates,
          kyc,
          enrollment,
          trainerProgress
        );

        interns.push({
          id: `${userKey}-${enrollment.internshipSlug}`,
          student: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone || kyc?.phone || "",
            isBlocked: user.IsBlocked,
            isActive: isActive && enrollmentActive,
            joinedAt: user.createdAt,
          },
          kyc: mapKycSummary(kyc, req.userRole),
          enrollment: {
            internshipSlug: enrollment.internshipSlug,
            programTitle: program?.title || enrollment.title || enrollment.internshipSlug,
            enrolledAt: enrollment.createdAt,
            enrollmentSource: enrollment.enrollmentSource || "invite",
            active: enrollmentActive,
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

/**
 * Manager queue for internship certificates.
 * query.track = tech (default) | business | all
 * status=pending (default) | issued | all
 */
const getInternshipApprovals = async (req, res) => {
  try {
    const status = String(req.query.status || "pending").toLowerCase();
    const track = String(req.query.track || "tech").toLowerCase();
    const filter = ["pending", "issued", "all"].includes(status) ? status : "pending";
    const trackFilter = ["tech", "business", "all"].includes(track) ? track : "tech";

    const [completedRows, approvedKycRows] = await Promise.all([
      InternshipStudentAssignment.find({
        internshipCompleted: true,
        active: { $ne: false },
      })
        .populate("studentId", "firstName lastName email phone role IsBlocked isActive createdAt")
        .sort({ internshipCompletedAt: -1 })
        .lean(),
      InternKyc.find({ approvalStatus: "approved" })
        .select("userId internshipSlug inviteId approvalStatus approvedAt phone fullName")
        .lean(),
    ]);

    const approvedUserIds = [
      ...new Set(approvedKycRows.map((row) => String(row.userId)).filter(Boolean)),
    ];

    const approvedEnrollments =
      approvedUserIds.length > 0
        ? await UserInternship.find({
            userId: { $in: approvedUserIds },
            active: { $ne: false },
          }).lean()
        : [];

    /** @type {Map<string, { userId: string, slug: string, trainerRow: object|null, enrollment: object|null }>} */
    const queueKeys = new Map();

    for (const row of completedRows) {
      const user = row.studentId;
      if (!user?._id) continue;
      const userId = String(user._id);
      const slug = row.internshipSlug;
      const key = `${userId}:${slug}`;
      queueKeys.set(key, { userId, slug, trainerRow: row, enrollment: null });
    }

    for (const enrollment of approvedEnrollments) {
      const userId = String(enrollment.userId);
      const slug = enrollment.internshipSlug;
      const key = `${userId}:${slug}`;

      // Prefer KYC that matches this program (or legacy empty slug)
      const matchingKyc = approvedKycRows.find((row) => {
        if (String(row.userId) !== userId) return false;
        if (!row.internshipSlug) return true;
        return row.internshipSlug === slug;
      });
      if (!matchingKyc) continue;

      const existing = queueKeys.get(key);
      if (existing) {
        existing.enrollment = enrollment;
      } else {
        queueKeys.set(key, { userId, slug, trainerRow: null, enrollment });
      }
    }

    if (!queueKeys.size) {
      return res.status(200).json({ approvals: [], summary: { pending: 0, issued: 0 } });
    }

    const studentIds = [...new Set([...queueKeys.values()].map((row) => row.userId))];

    const [certificates, certificateTemplates, enrollments, kycRecords, users] =
      await Promise.all([
        InternshipCertificate.find({ userId: { $in: studentIds } }).lean(),
        CertificateTemplate.find({}).select("_id label type active"),
        UserInternship.find({
          userId: { $in: studentIds },
          active: { $ne: false },
        }).lean(),
        InternKyc.find({ userId: { $in: studentIds } }).lean(),
        UserModel.find({ _id: { $in: studentIds } })
          .select("firstName lastName email phone role IsBlocked isActive createdAt")
          .lean(),
      ]);

    const templateMap = new Map(certificateTemplates.map((row) => [String(row._id), row]));
    const enrollmentByKey = new Map(
      enrollments.map((row) => [`${String(row.userId)}:${row.internshipSlug}`, row])
    );
    const userById = new Map(users.map((row) => [String(row._id), row]));

    const approvals = [];
    let pendingCount = 0;
    let issuedCount = 0;

    for (const item of queueKeys.values()) {
      const populated = item.trainerRow?.studentId;
      const user =
        populated && typeof populated === "object" && populated._id
          ? populated
          : userById.get(item.userId);
      if (!user?._id) continue;
      const userId = String(user._id);
      const slug = item.slug;
      const enrollment =
        item.enrollment ||
        enrollmentByKey.get(`${userId}:${slug}`) ||
        enrollments.find((e) => String(e.userId) === userId && e.internshipSlug === slug) ||
        null;

      // KYC-only rows must still have an active enrollment
      if (!item.trainerRow && !enrollment) continue;

      const program = getInternshipBySlug(slug);
      const programTitle = program?.title || enrollment?.title || slug;

      // track=tech → technical/paid-tech only; track=business → HR/sales/BD/marketing
      const isTech = isTechInternshipProgram(slug, programTitle);
      if (trackFilter === "tech" && !isTech) continue;
      if (trackFilter === "business" && isTech) continue;
      const programTemplateId = program?.certificateTemplateId
        ? String(program.certificateTemplateId)
        : null;
      const programTemplate = programTemplateId
        ? templateMap.get(programTemplateId)
        : null;

      const issuedRows = pickCertificatesFromList(certificates, userId, slug);
      const programCertificates = issuedRows.map((cert) =>
        mapIssuedCertificate(cert, templateMap)
      );
      const hasInternshipCompletionCert = issuedRows.some((cert) =>
        isInternshipCompletionCertificate(cert, templateMap)
      );
      const awaitingInternshipCertificate = !hasInternshipCompletionCert;

      const kyc = pickKycFromList(kycRecords, userId, slug);
      const kycApproved = (kyc?.approvalStatus || "pending") === "approved";

      // Pending queue: trainer-complete OR KYC-approved, still need completion cert
      if (awaitingInternshipCertificate) {
        if (!item.trainerRow && !kycApproved) continue;
        pendingCount += 1;
      } else {
        issuedCount += 1;
      }

      if (filter === "pending" && !awaitingInternshipCertificate) continue;
      if (filter === "issued" && awaitingInternshipCertificate) continue;

      const trainerProgress = item.trainerRow || null;
      const certificateMeta = buildCertificateMeta(
        programCertificates,
        kyc,
        enrollment,
        trainerProgress
      );
      const completionCertificate =
        programCertificates.find((c) => {
          if (c.certificateType === "internship-completion") return true;
          const label = String(c.templateLabel || "");
          if (/tech\s*internship|non[\s-]*tech|internship\s*completion/i.test(label)) {
            return true;
          }
          return Boolean(c.fromDate && c.toDate);
        }) || null;

      approvals.push({
        id: `${userId}-${slug}`,
        student: {
          id: userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || kyc?.phone || "",
          role: user.role,
          isBlocked: user.IsBlocked,
          isActive: user.isActive !== false,
          joinedAt: user.createdAt,
        },
        kyc: mapKycSummary(kyc, req.userRole),
        enrollment: {
          internshipSlug: slug,
          programTitle,
          enrolledAt: enrollment?.createdAt || null,
          enrollmentSource: enrollment?.enrollmentSource || (trainerProgress ? "trainer" : "invite"),
          active: enrollment ? enrollment.active !== false : true,
          certificateTemplateId: programTemplateId,
          certificateTemplateLabel: programTemplate?.label || null,
        },
        ...certificateMeta,
        completionCertificate,
        internshipCompleted: Boolean(trainerProgress?.internshipCompleted),
        internshipCompletedAt: trainerProgress?.internshipCompletedAt || null,
        internshipCompletedOverride: Boolean(trainerProgress?.internshipCompletedOverride),
        awaitingInternshipCertificate,
        queueSource: trainerProgress?.internshipCompleted
          ? "trainer-complete"
          : "kyc-approved",
      });
    }

    // Newest activity first: trainer completedAt, else KYC approvedAt, else enrollment
    approvals.sort((a, b) => {
      const aTime = new Date(
        a.internshipCompletedAt || a.kyc?.approvedAt || a.enrollment?.enrolledAt || 0
      ).getTime();
      const bTime = new Date(
        b.internshipCompletedAt || b.kyc?.approvedAt || b.enrollment?.enrolledAt || 0
      ).getTime();
      return bTime - aTime;
    });

    res.status(200).json({
      approvals,
      summary: { pending: pendingCount, issued: issuedCount },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load internship approvals" });
  }
};

async function findInternUser(userId, res) {
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404).json({ message: "Intern not found" });
    return null;
  }
  if (user.role === "intern") return user;

  // Staff/student accounts that completed KYC still need approve / cert actions
  const hasKyc = await InternKyc.exists({ userId: user._id });
  if (hasKyc) return user;

  const hasInviteEnrollment = await UserInternship.exists({
    userId: user._id,
    enrollmentSource: "invite",
  });
  if (hasInviteEnrollment) return user;

  res.status(400).json({ message: "This action is only available for career intern accounts" });
  return null;
}

/** Any enrolled student/intern account (trainer progress uses non-intern roles too). */
async function findCertificateRecipient(userId, res) {
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404).json({ message: "Student not found" });
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
      return res.status(400).json({ message: "You cannot deactivate your own account" });
    }

    const internshipSlug = req.body?.internshipSlug || req.query?.internshipSlug || null;

    if (internshipSlug) {
      await Promise.all([
        UserInternship.updateMany(
          { userId: user._id, internshipSlug },
          { $set: { active: false } }
        ),
        InternshipStudentAssignment.updateMany(
          { studentId: user._id, internshipSlug },
          { $set: { active: false } }
        ),
      ]);

      const remainingActive = await UserInternship.countDocuments({
        userId: user._id,
        active: { $ne: false },
      });
      if (remainingActive === 0) {
        user.isActive = false;
        await user.save();
      }

      return res.status(200).json({
        message: "Intern enrollment marked inactive",
        intern: {
          id: user._id,
          email: user.email,
          internshipSlug,
          isActive: user.isActive !== false,
        },
      });
    }

    await Promise.all([
      UserInternship.updateMany({ userId: user._id }, { $set: { active: false } }),
      InternshipStudentAssignment.updateMany(
        { studentId: user._id },
        { $set: { active: false } }
      ),
    ]);

    user.isActive = false;
    await user.save();

    res.status(200).json({
      message: "Intern marked inactive",
      intern: { id: user._id, email: user.email, isActive: false },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const reactivateInternProfile = async (req, res) => {
  try {
    const user = await findInternUser(req.params.id, res);
    if (!user) return;

    const internshipSlug = req.body?.internshipSlug || null;

    user.isActive = true;
    await user.save();

    if (internshipSlug) {
      await Promise.all([
        UserInternship.updateMany(
          { userId: user._id, internshipSlug },
          { $set: { active: true } }
        ),
        InternshipStudentAssignment.updateMany(
          { studentId: user._id, internshipSlug },
          { $set: { active: true } }
        ),
      ]);
    } else {
      await Promise.all([
        UserInternship.updateMany({ userId: user._id }, { $set: { active: true } }),
        InternshipStudentAssignment.updateMany(
          { studentId: user._id },
          { $set: { active: true } }
        ),
      ]);
    }

    res.status(200).json({
      message: "Intern reactivated",
      intern: {
        id: user._id,
        email: user.email,
        isActive: true,
        internshipSlug: internshipSlug || null,
      },
    });
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
    const user = await findCertificateRecipient(req.params.id, res);
    if (!user) return;

    let internshipSlug = String(req.body?.internshipSlug || "").trim();
    if (!internshipSlug) {
      internshipSlug = await resolveInternshipSlugForUser(user._id, req.body?.internshipSlug);
    }
    if (!internshipSlug) {
      return res.status(400).json({ message: "internshipSlug is required" });
    }

    const trainerAssignment = await InternshipStudentAssignment.findOne({
      studentId: user._id,
      internshipSlug,
      active: { $ne: false },
    }).lean();

    let enrollment = await UserInternship.findOne({ userId: user._id, internshipSlug });
    if (!enrollment && !trainerAssignment) {
      return res.status(400).json({ message: "Student is not enrolled in this program" });
    }

    const kyc = await findKycForProgram(user._id, internshipSlug);
    // Internship completion (after trainer mark) may issue without KYC; other templates need approved KYC.
    if (kyc && (kyc.approvalStatus || "pending") === "rejected") {
      return res.status(400).json({
        message: "KYC was rejected for this student. Resolve KYC before issuing a certificate.",
      });
    }

    const program = getInternshipBySlug(internshipSlug);
    if (!program && !enrollment) {
      return res.status(400).json({ message: "Invalid internship program" });
    }

    const certificateTemplateId = req.body?.certificateTemplateId;
    if (!certificateTemplateId) {
      return res.status(400).json({ message: "Certificate template is required" });
    }

    const certificateTemplate = await CertificateTemplate.findOne({
      _id: certificateTemplateId,
      active: true,
    });
    if (!certificateTemplate) {
      return res.status(400).json({ message: "Valid active certificate template is required" });
    }
    if (String(certificateTemplate.type || "").startsWith("offer-letter")) {
      return res.status(400).json({ message: "Offer letter templates cannot be issued here" });
    }

    const issuableTypeSlugs = await getIssuableCertificateTypeSlugs();
    const fromDate = parseManualIssuedAt(req.body?.fromDate);
    const toDate = parseManualIssuedAt(req.body?.toDate);
    const issuedAt =
      parseManualIssuedAt(req.body?.issuedAt) || toDate || fromDate;

    // Internship Approvals always sends from/to; also treat typed internship-completion the same.
    const isInternshipCompletionFlow =
      certificateTemplate.type === "internship-completion" || Boolean(fromDate && toDate);

    if (
      !isInternshipCompletionFlow &&
      !issuableTypeSlugs.includes(certificateTemplate.type)
    ) {
      return res.status(400).json({ message: "Valid active certificate template is required" });
    }

    if (isInternshipCompletionFlow) {
      const wantsOverride = Boolean(req.body?.manualOverride);
      const isNonTech = /non[\s-]*tech/i.test(String(certificateTemplate.label || ""));
      const isAdminUser =
        req.userRole === "admin" ||
        req.user?.role === "admin" ||
        req.user?.effectiveRole === "admin";

      // Admins may always override trainer-completion gate for internship certs.
      // Managers may override Non Tech only when manualOverride is sent.
      const overrideAllowed =
        isAdminUser || (wantsOverride && isNonTech);

      if (wantsOverride && !isAdminUser && !isNonTech) {
        return res.status(400).json({
          message: "Manual override is only allowed for Non Tech certificates (managers)",
        });
      }

      if (!trainerAssignment?.internshipCompleted && !overrideAllowed) {
        return res.status(400).json({
          message:
            "Trainer must mark this internship completed before issuing. Managers can use Manual override for Non Tech; admins can always override.",
        });
      }
      if (!fromDate || !toDate) {
        return res.status(400).json({
          message: "From date and to date are required (YYYY-MM-DD)",
        });
      }
      if (fromDate.getTime() > toDate.getTime()) {
        return res.status(400).json({
          message: "From date must be on or before the to date",
        });
      }
    } else {
      if (!issuedAt) {
        return res.status(400).json({
          message: "Certificate issue date is required (YYYY-MM-DD)",
        });
      }
      if (!kyc || (kyc.approvalStatus || "pending") !== "approved") {
        return res.status(400).json({
          message: "Intern must be approved for this program before this certificate can be issued",
        });
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
    }

    const studentName = (
      req.body?.studentName ||
      kyc?.fullName ||
      `${user.firstName || ""} ${user.lastName || ""}`
    ).trim();
    if (!studentName) {
      return res.status(400).json({ message: "Student name is required" });
    }

    const existing = await InternshipCertificate.findOne({
      userId: user._id,
      internshipSlug,
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
          issuedAt: effectiveCertificateIssuedAt(existing),
        },
      });
    }

    const certificate = await InternshipCertificate.create({
      userId: user._id,
      internshipSlug,
      programTitle: resolveProgramTitle(internshipSlug, {
        enrollmentTitle: enrollment?.title,
        storedTitle: program?.title,
      }),
      studentName,
      uuid: await generateUniqueCertificateId("internship"),
      certificateTemplateId: certificateTemplate._id,
      certificateType: certificateTemplate.type,
      issuedBy: req.user._id,
      issuedAt: issuedAt || toDate || new Date(),
      fromDate: fromDate || null,
      toDate: toDate || issuedAt || null,
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
        issuedAt: effectiveCertificateIssuedAt(certificate),
        fromDate: certificate.fromDate,
        toDate: certificate.toDate,
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
        issuedAt: effectiveCertificateIssuedAt(c),
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
    const role = req.userRole || req.user?.role;

    if (recordType === "course-completion") {
      if (role !== "admin") {
        return res.status(403).json({ message: "Only admins can delete course certificates" });
      }
      const deleted = await CourseCertificate.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Certificate not found" });
      return res.status(200).json({ message: "Course certificate deleted" });
    }

    // Internship completion — managers and admins can unissue
    if (role !== "admin" && role !== "manager") {
      return res.status(403).json({ message: "Not allowed to unissue certificates" });
    }

    const deleted = await InternshipCertificate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Certificate not found" });
    res.status(200).json({ message: "Internship certificate unissued" });
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

/** Manager draft preview before issuing (does not save a certificate). */
const previewInternshipCertificateDraft = async (req, res) => {
  try {
    const internshipSlug = String(req.body?.internshipSlug || "").trim();
    const studentId = String(req.body?.studentId || "").trim();
    const certificateTemplateId = req.body?.certificateTemplateId;
    const studentName = String(req.body?.studentName || "").trim();
    const fromDate = parseManualIssuedAt(req.body?.fromDate);
    const toDate = parseManualIssuedAt(req.body?.toDate);

    if (!internshipSlug || !studentId || !certificateTemplateId || !studentName) {
      return res.status(400).json({
        message: "studentId, internshipSlug, certificateTemplateId, and studentName are required",
      });
    }
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "From date and to date are required" });
    }
    if (fromDate.getTime() > toDate.getTime()) {
      return res.status(400).json({ message: "From date must be on or before the to date" });
    }

    const user = await UserModel.findById(studentId).select("firstName lastName email");
    if (!user) {
      return res.status(404).json({ message: "Student not found" });
    }

    const template = await CertificateTemplate.findOne({
      _id: certificateTemplateId,
      active: true,
    });
    if (!template?.pdfUrl) {
      return res.status(404).json({ message: "Certificate template not found" });
    }

    const enrollment = await UserInternship.findOne({
      userId: studentId,
      internshipSlug,
    }).select("title");
    const programTitle = resolveProgramTitle(internshipSlug, {
      enrollmentTitle: enrollment?.title,
      storedTitle: getInternshipBySlug(internshipSlug)?.title,
    });

    const pdfBytes = await buildInternshipCompletionPdf({
      pdfUrl: template.pdfUrl,
      templateLabel: template.label,
      studentName,
      programTitle,
      uuid: "PREVIEW",
      issuedAt: toDate,
      fromDate,
      toDate,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${studentName.replace(/\s+/g, "_")}_certificate_preview.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("previewInternshipCertificateDraft error:", err);
    res.status(500).json({ message: "Failed to generate certificate preview" });
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
      issuedAt: effectiveCertificateIssuedAt(certificate),
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
      .sort({ createdAt: -1 });

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

async function createAndSendInvite({
  email,
  firstName,
  lastName,
  internshipSlug,
  inviteMessage,
  invitedBy,
  program,
}) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    return { ok: false, email: normalizedEmail, reason: "Email is required" };
  }
  if (!isGmailAddress(normalizedEmail)) {
    return {
      ok: false,
      email: normalizedEmail,
      reason: "Only Gmail addresses are allowed",
    };
  }

  const existingPending = await InternInvite.findOne({
    email: normalizedEmail,
    internshipSlug,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });
  if (existingPending) {
    return {
      ok: false,
      email: normalizedEmail,
      reason: "A pending invite already exists for this email",
    };
  }

  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invite = await InternInvite.create({
    email: normalizedEmail,
    firstName: String(firstName || "").trim(),
    lastName: String(lastName || "").trim(),
    internshipSlug,
    token,
    invitedBy,
    expiresAt,
    inviteMessage: String(inviteMessage || "").trim(),
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

  return {
    ok: true,
    email: normalizedEmail,
    invite: {
      id: invite._id,
      email: invite.email,
      inviteUrl,
      expiresAt: invite.expiresAt,
      programTitle: program.title,
    },
  };
}

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

    const result = await createAndSendInvite({
      email,
      firstName,
      lastName,
      internshipSlug: slug,
      inviteMessage,
      invitedBy: req.user._id,
      program,
    });

    if (!result.ok) {
      return res.status(400).json({ message: result.reason });
    }

    res.status(201).json({
      message: "Invite sent successfully",
      invite: result.invite,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const createInviteBulk = async (req, res) => {
  try {
    const { emails, internshipSlug, inviteMessage, firstName, lastName } = req.body;
    const list = Array.isArray(emails)
      ? emails.map((e) => String(e || "").trim().toLowerCase()).filter(Boolean)
      : [];
    // Deduplicate while preserving order
    const uniqueEmails = [...new Set(list)];

    if (!uniqueEmails.length) {
      return res.status(400).json({ message: "Add at least one email address" });
    }
    if (uniqueEmails.length > 50) {
      return res.status(400).json({ message: "Maximum 50 emails per bulk invite" });
    }

    const slug = internshipSlug || "sales-marketing";
    const program = getInternshipBySlug(slug);
    if (!program) {
      return res.status(400).json({ message: "Invalid internship program" });
    }
    if (program.track !== "careers") {
      return res.status(400).json({ message: "Invites are only for careers internships" });
    }

    const sent = [];
    const failed = [];

    for (const email of uniqueEmails) {
      try {
        const result = await createAndSendInvite({
          email,
          firstName,
          lastName,
          internshipSlug: slug,
          inviteMessage,
          invitedBy: req.user._id,
          program,
        });
        if (result.ok) sent.push(result.invite);
        else failed.push({ email: result.email || email, reason: result.reason });
      } catch (err) {
        console.error("Bulk invite error for", email, err);
        failed.push({ email, reason: "Failed to send invite" });
      }
    }

    res.status(sent.length ? 201 : 400).json({
      message: `Sent ${sent.length} invite(s)${
        failed.length ? `, ${failed.length} failed` : ""
      }`,
      sent,
      failed,
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
      .populate("userId", "firstName lastName email phone")
      .populate("issuedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      offerLetters: letters.map((row) => ({
        id: row._id,
        candidateName: row.candidateName,
        internshipSlug: row.internshipSlug,
        templateId: row.templateId || "",
        templateLabel: row.templateLabel || "",
        issuedAt: row.createdAt,
        user: row.userId
          ? {
              email: row.userId.email,
              phone: row.userId.phone || "",
              name: `${row.userId.firstName || ""} ${row.userId.lastName || ""}`.trim(),
            }
          : null,
        issuedBy: row.issuedBy
          ? {
              email: row.issuedBy.email,
              name: `${row.issuedBy.firstName || ""} ${row.issuedBy.lastName || ""}`.trim(),
            }
          : null,
      })),
      total: letters.length,
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

/**
 * Course access management (admin + manager).
 * Role-guarded grant/revoke of course access (moved out of the main app).
 */
const listCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({})
      .select("courseTitle offeredPrice")
      .sort({ courseTitle: 1 })
      .lean();
    res.status(200).json({
      courses: courses.map((row) => ({
        id: String(row._id),
        title: row.courseTitle,
        price: row.offeredPrice,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load courses" });
  }
};

/** Full user list for the "Grant access" username dropdown (id + name + email). */
const listCourseAccessUsers = async (req, res) => {
  try {
    const users = await UserModel.find({})
      .select("firstName lastName email")
      .sort({ firstName: 1 })
      .lean();
    res.status(200).json({
      users: users.map((row) => ({
        id: String(row._id),
        name: `${row.firstName || ""} ${row.lastName || ""}`.trim() || row.email || "—",
        email: row.email || "",
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load users" });
  }
};

function mapCourseAccessUser(user, mergedCourseIds, isAllCourse, courseTitleMap) {
  const courses = (mergedCourseIds || []).map((id) => ({
    id: String(id),
    title: courseTitleMap.get(String(id)) || "Course",
  }));
  return {
    id: String(user._id),
    name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "—",
    email: user.email || "",
    role: user.role || "student",
    isAllCourse: Boolean(isAllCourse),
    courseCount: isAllCourse ? courseTitleMap.size : courses.length,
    courses,
  };
}

const listCourseAccess = async (req, res) => {
  try {
    const search = String(req.query.search || "").trim();
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const allCourses = await CourseModel.find({}).select("courseTitle").lean();
    const courseTitleMap = new Map(
      allCourses.map((row) => [String(row._id), row.courseTitle])
    );

    let users = [];
    let total = 0;

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const query = { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] };
      total = await UserModel.countDocuments(query);
      users = await UserModel.find(query)
        .select("firstName lastName email role")
        .sort({ firstName: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      // Default view: only users who already have some course access
      const accessRows = await UserCourse.find({}).select("userId").lean();
      const userIds = [...new Set(accessRows.map((row) => String(row.userId)))];
      total = userIds.length;
      const pageIds = userIds.slice(skip, skip + limit);
      users = await UserModel.find({ _id: { $in: pageIds } })
        .select("firstName lastName email role")
        .lean();
    }

    // Merge every UserCourse doc for this page in a single query (avoids N+1).
    const pageUserIds = users.map((user) => user._id);
    const courseDocs = pageUserIds.length
      ? await UserCourse.find({ userId: { $in: pageUserIds } })
          .select("userId courseIds isAllCourse")
          .lean()
      : [];

    const stateByUser = new Map();
    for (const doc of courseDocs) {
      const key = String(doc.userId);
      const existing = stateByUser.get(key) || { courseIds: new Set(), isAllCourse: false };
      for (const id of doc.courseIds || []) existing.courseIds.add(String(id));
      if (doc.isAllCourse) existing.isAllCourse = true;
      stateByUser.set(key, existing);
    }

    const rows = users.map((user) => {
      const state = stateByUser.get(String(user._id));
      return mapCourseAccessUser(
        user,
        state ? [...state.courseIds] : [],
        state ? state.isAllCourse : false,
        courseTitleMap
      );
    });

    // Users with access first, then by name
    rows.sort((a, b) => {
      const aHas = a.isAllCourse || a.courses.length > 0 ? 1 : 0;
      const bHas = b.isAllCourse || b.courses.length > 0 ? 1 : 0;
      if (aHas !== bHas) return bHas - aHas;
      return a.name.localeCompare(b.name);
    });

    res.status(200).json({
      users: rows,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load course access" });
  }
};

const grantCourseAccess = async (req, res) => {
  try {
    const { userId, courseId, allCourses, paymentId } = req.body || {};
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await UserModel.findById(userId).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (allCourses) {
      const courses = await CourseModel.find({}).select("_id");
      if (!courses.length) {
        return res.status(404).json({ message: "No courses found" });
      }
      const transaction = await Transaction.create({
        userId,
        paymentMethod: "Manual",
        paymentId: paymentId || `crm-grant-all-${Date.now()}`,
        subscribedAllCourse: true,
        amount: 0,
      });
      await grantAllCoursesAccess(
        userId,
        courses.map((row) => row._id),
        transaction._id
      );
      return res.status(200).json({ message: "All-course access granted" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }
    const course = await CourseModel.findById(courseId).select("_id offeredPrice");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const transaction = await Transaction.create({
      userId,
      courseId,
      paymentMethod: "Manual",
      paymentId: paymentId || `crm-grant-${Date.now()}`,
      amount: Number(course.offeredPrice) || 0,
    });
    await grantSingleCourseAccess(userId, courseId, transaction._id);
    res.status(200).json({ message: "Course access granted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to grant course access" });
  }
};

const revokeCourseAccess = async (req, res) => {
  try {
    const { userId, courseId, allCourses } = req.body || {};
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (allCourses) {
      await revokeAllCourseAccess(userId);
      return res.status(200).json({ message: "All course access revoked" });
    }

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }
    await revokeSingleCourseAccess(userId, courseId);
    res.status(200).json({ message: "Course access revoked" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to revoke course access" });
  }
};

module.exports = {
  getOverview,
  getManagerDashboard,
  listCourses,
  listCourseAccessUsers,
  listCourseAccess,
  grantCourseAccess,
  revokeCourseAccess,
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
  createInviteBulk,
  deleteInvite,
  deleteUser,
  recordOfferLetter,
  listIssuedOfferLetters,
};
