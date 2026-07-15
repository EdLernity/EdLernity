const UserInternship = require("../models/userInternshipSchema");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const InternshipStudentAssignment = require("../models/internshipStudentAssignmentSchema");
const InternshipWorkSubmission = require("../models/internshipWorkSubmissionSchema");
const InternshipAttendance = require("../models/internshipAttendanceSchema");
const { getInternshipBySlug, resolveProgramTitle } = require("../utils/internshipCatalog");
const { getOrCreateProgramConfig } = require("./internshipAdminController");
const { STATIC_CERTIFICATE, resolveBonuses } = require("../utils/internshipConfigDefaults");
const {
  normalizeLiveClasses,
  normalizePassingScore,
  isAssignmentPassed,
} = require("../utils/internshipLiveClasses");
const { evaluateAttendanceWindow } = require("../utils/liveClassAttendanceWindow");
const {
  buildInternshipCompletionPdf,
  resolveInternshipCertificateDates,
} = require("../utils/certificatePdfUtils");
const { resolveCertificateTemplateForProgram } = require("../utils/programTemplateService");

const DEFAULT_HIGHLIGHTS = [
  "12-week structured internship curriculum",
  "Live mentor sessions three times a week",
  "Hands-on assignments and projects",
  "Recordings, notes, and bonus workshops",
  "ISO 9001:2015 internship certificate",
];

function mapQuestionForStudent(question, revealAnswers) {
  const base = {
    id: question.id,
    type: question.type,
    prompt: question.prompt,
    options: question.type === "mcq" ? question.options || [] : [],
  };
  if (revealAnswers && question.type === "mcq") {
    base.correctOptionIndex = question.correctOptionIndex;
  }
  return base;
}

function mapClassAssignment(assignment, submission) {
  const questions = Array.isArray(assignment?.questions) ? assignment.questions : [];
  const submitted = Boolean(submission);
  const passingScore = normalizePassingScore(assignment?.passingScore);
  const mcqScore = submission?.mcqScore ?? 0;
  const mcqTotal = submission?.mcqTotal ?? 0;
  const passed = submitted
    ? isAssignmentPassed(mcqScore, mcqTotal, passingScore)
    : null;
  return {
    title: assignment?.title || "",
    dueLabel: assignment?.dueLabel || "",
    instructions: assignment?.instructions || "",
    passingScore,
    questions: questions.map((q) => mapQuestionForStudent(q, submitted)),
    mySubmission: submitted
      ? {
          answers: submission.answers || [],
          mcqScore,
          mcqTotal,
          passed,
          passingScore,
          submittedAt: submission.submittedAt,
        }
      : null,
  };
}

/** Simple pass-through: students see what the trainer configured. */
function mapModule(module, weekIndex, submissionMap = {}, attendanceMap = {}) {
  const normalized = normalizeLiveClasses(module);
  const liveClasses = normalized.map((row) => {
    const submission =
      submissionMap[`assignment:${weekIndex}:${row.id}`] || null;
    const attendance = attendanceMap[`${weekIndex}:${row.id}`] || null;
    const window = evaluateAttendanceWindow(row);
    return {
      id: row.id,
      title: row.title,
      schedule: {
        day: row.scheduleDay || "",
        time: row.scheduleTime || "",
      },
      meetingLink: row.meetingLink || null,
      recordingUrl: row.recordingUrl || null,
      noteTitle: row.noteTitle || null,
      noteUrl: row.noteUrl || null,
      assignment: mapClassAssignment(row.assignment, submission),
      attended: Boolean(attendance),
      joinedAt: attendance?.joinedAt || null,
      lastJoinedAt: attendance?.lastJoinedAt || null,
      joinCount: attendance?.joinCount || 0,
      attendanceOpen: Boolean(window.inWindow),
      attendanceHint: attendance
        ? "Attendance already marked for this class."
        : window.canMark
          ? "Joining now will mark your attendance."
          : window.reason ||
            "Attendance is only marked during the scheduled class window.",
    };
  });
  const primary = liveClasses[0] || {
    id: "class-1",
    title: `${module.week || `Week ${weekIndex + 1}`} Live Session`,
    schedule: { day: "", time: "" },
    meetingLink: null,
    recordingUrl: null,
    noteTitle: null,
    noteUrl: null,
    assignment: mapClassAssignment(null, null),
    attended: false,
    joinedAt: null,
    lastJoinedAt: null,
    joinCount: 0,
  };
  const recordingUrl =
    liveClasses.find((row) => row.recordingUrl)?.recordingUrl ||
    module.recording?.url ||
    null;
  const notesFromClasses = liveClasses
    .filter((row) => row.noteTitle || row.noteUrl)
    .map((row) => ({
      title: row.noteTitle || "Class notes",
      type: "pdf",
      url: row.noteUrl || null,
      available: Boolean(row.noteUrl),
    }));

  const isProject = Boolean(module.isCapstone);
  const projectAnchor =
    typeof module.assignment?.projectAnchorWeekIndex === "number"
      ? module.assignment.projectAnchorWeekIndex
      : null;
  const isProjectSecondary =
    isProject && projectAnchor != null && projectAnchor !== weekIndex;
  const submissionWeekIndex = isProjectSecondary ? projectAnchor : weekIndex;
  const projectSubmission =
    submissionMap[`project:${submissionWeekIndex}:`] || null;
  const spanWeeks = Math.min(
    3,
    Math.max(1, Number(module.assignment?.spanWeeks) || 1)
  );

  return {
    id: `week-${weekIndex + 1}`,
    weekIndex,
    week: module.week,
    topic: module.topic,
    isCapstone: module.isCapstone,
    published: module.published !== false,
    liveClasses,
    liveClass: primary,
    recording: {
      title: module.recording?.title || `${module.week} Recording`,
      duration: module.recording?.duration || "1h 45m",
      url: recordingUrl,
      available: Boolean(recordingUrl),
    },
    notes: notesFromClasses.length
      ? notesFromClasses
      : (module.notes || []).map((note) => ({
          title: note.title,
          type: note.type || "pdf",
          url: note.url || null,
          available: Boolean(note.url),
        })),
    assignment: {
      title: module.assignment?.title || "",
      dueLabel: module.assignment?.dueLabel || "",
      instructions: module.assignment?.instructions || "",
      type: isProject ? "project" : module.assignment?.type || "assignment",
      githubRequired: isProject ? true : Boolean(module.assignment?.githubRequired),
      documentUrl: module.assignment?.documentUrl || "",
      documentTitle: module.assignment?.documentTitle || "",
      spanWeeks,
      projectAnchorWeekIndex: projectAnchor,
      isProjectSecondary,
      submitWeekIndex: submissionWeekIndex,
      mySubmission: projectSubmission
        ? {
            githubUrl: projectSubmission.githubUrl || "",
            submittedAt: projectSubmission.submittedAt,
            reviewStatus: projectSubmission.reviewStatus || "pending",
            reviewReason: projectSubmission.reviewReason || "",
            reviewedAt: projectSubmission.reviewedAt || null,
          }
        : null,
    },
    resources: (module.resources || []).map((r) => ({
      title: r.title,
      type: r.type || "reference",
      url: r.url || null,
      available: Boolean(r.url),
    })),
  };
}

async function loadSubmissionMap(userId, slug) {
  const rows = await InternshipWorkSubmission.find({
    userId,
    internshipSlug: slug,
  }).lean();
  const map = {};
  for (const row of rows) {
    const classKey = row.classId == null ? "" : row.classId;
    map[`${row.kind}:${row.weekIndex}:${classKey}`] = row;
  }
  return map;
}

async function loadAttendanceMap(userId, slug) {
  const rows = await InternshipAttendance.find({
    userId,
    internshipSlug: slug,
  }).lean();
  const map = {};
  for (const row of rows) {
    map[`${row.weekIndex}:${row.classId}`] = row;
  }
  return map;
}

async function ensureEnrolled(userId, slug) {
  return UserInternship.findOne({
    userId,
    internshipSlug: slug,
    active: { $ne: false },
  });
}

function findClassInConfig(config, weekIndex, classId) {
  const mod = (config.modules || []).find(
    (m, index) => (m.weekIndex ?? index) === weekIndex
  );
  if (!mod) return { mod: null, liveClass: null, resolvedWeekIndex: weekIndex };
  const classes = normalizeLiveClasses(mod);
  const liveClass =
    classes.find((c) => c.id === classId) ||
    classes.find((_, i) => String(i) === String(classId));
  return {
    mod,
    liveClass,
    resolvedWeekIndex: mod.weekIndex ?? weekIndex,
    classes,
  };
}

const getStudentDashboard = async (req, res) => {
  try {
    const { slug } = req.params;
    const enrollment = await ensureEnrolled(req.user._id, slug);

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this program" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) {
      return res.status(404).json({ message: "Program not found" });
    }

    const [submissionMap, attendanceMap] = await Promise.all([
      loadSubmissionMap(req.user._id, slug),
      loadAttendanceMap(req.user._id, slug),
    ]);
    const catalogEntry = getInternshipBySlug(slug);
    const modules = (config.modules || []).map((m, index) =>
      mapModule(m, m.weekIndex ?? index, submissionMap, attendanceMap)
    );

    const [issuedCertificates, trainerAssignment] = await Promise.all([
      InternshipCertificate.find({
        userId: req.user._id,
        internshipSlug: slug,
      })
        .sort({ createdAt: -1 })
        .lean(),
      InternshipStudentAssignment.findOne({
        studentId: req.user._id,
        internshipSlug: slug,
        active: { $ne: false },
      })
        .select(
          "internshipCompleted internshipCompletedAt internshipCompletedOverride"
        )
        .lean(),
    ]);
    const issuedCertificate =
      issuedCertificates.find((c) => c.certificateType === "internship-completion") ||
      issuedCertificates[0] ||
      null;

    const totalWeeks = modules.length;
    const weeksWithLinks = modules.filter(
      (m) =>
        (m.liveClasses || []).some((c) => c.meetingLink || c.recordingUrl) ||
        m.liveClass?.meetingLink ||
        m.liveClass?.recordingUrl ||
        m.recording?.url
    ).length;
    const progressPercent = totalWeeks
      ? Math.round((weeksWithLinks / totalWeeks) * 100)
      : 0;

    res.status(200).json({
      program: {
        slug: config.internshipSlug,
        title: config.title || enrollment.title,
        category: config.category || enrollment.category,
        coverImage: catalogEntry?.coverImage || config.coverImage || enrollment.coverImage,
        duration: `${totalWeeks || 12} Weeks`,
        batchLabel: "Current Batch",
        syllabusNote: config.syllabusNote,
        tools: config.tools || [],
        highlights: config.highlights?.length ? config.highlights : DEFAULT_HIGHLIGHTS,
      },
      enrollment: {
        enrolledAt: enrollment.createdAt,
        progressPercent,
        completedWeeks: weeksWithLinks,
        totalWeeks,
        currentWeek: modules[0] || null,
      },
      modules,
      liveSchedule: config.liveSchedule || [],
      bonuses: resolveBonuses(config.bonuses),
      certificate: {
        ...STATIC_CERTIFICATE,
        progressLabel: `${totalWeeks} week program`,
        issued: Boolean(issuedCertificate),
        id: issuedCertificate?._id ? String(issuedCertificate._id) : null,
        uuid: issuedCertificate?.uuid || null,
        studentName: issuedCertificate?.studentName || null,
        programTitle:
          issuedCertificate?.programTitle ||
          config.title ||
          enrollment.title ||
          slug,
        issuedAt: issuedCertificate?.issuedAt || issuedCertificate?.createdAt || null,
        certificateType: issuedCertificate?.certificateType || null,
        pdfAvailable: Boolean(issuedCertificate),
        internshipCompleted: Boolean(trainerAssignment?.internshipCompleted),
        internshipCompletedAt: trainerAssignment?.internshipCompletedAt || null,
        awaitingManagerIssuance:
          Boolean(trainerAssignment?.internshipCompleted) && !issuedCertificate,
      },
      announcements: config.announcements || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const submitClassAssignment = async (req, res) => {
  try {
    const { slug, classId } = req.params;
    const weekIndex = Number(req.body.weekIndex);
    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];

    if (!Number.isInteger(weekIndex) || weekIndex < 0) {
      return res.status(400).json({ message: "weekIndex is required" });
    }

    const enrollment = await ensureEnrolled(req.user._id, slug);
    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this program" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) return res.status(404).json({ message: "Program not found" });

    const { mod, liveClass, resolvedWeekIndex } = findClassInConfig(
      config,
      weekIndex,
      classId
    );
    if (!mod || !liveClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    if (mod.isCapstone) {
      return res.status(400).json({
        message: "Use the project submit endpoint for project weeks",
      });
    }

    const questions = liveClass.assignment?.questions || [];
    if (!questions.length) {
      return res.status(400).json({ message: "No questions configured for this class" });
    }

    const answerById = Object.fromEntries(
      answers.map((a) => [a.questionId, a])
    );
    let mcqScore = 0;
    let mcqTotal = 0;
    const normalizedAnswers = questions.map((q) => {
      const given = answerById[q.id] || {};
      if (q.type === "mcq") {
        mcqTotal += 1;
        const selected =
          typeof given.selectedIndex === "number" ? given.selectedIndex : null;
        if (selected === q.correctOptionIndex) mcqScore += 1;
        return { questionId: q.id, selectedIndex: selected, textAnswer: "" };
      }
      return {
        questionId: q.id,
        selectedIndex: null,
        textAnswer: String(given.textAnswer || "").trim(),
      };
    });

    const passingScore = normalizePassingScore(liveClass.assignment?.passingScore);
    const passed = isAssignmentPassed(mcqScore, mcqTotal, passingScore);

    const doc = await InternshipWorkSubmission.findOneAndUpdate(
      {
        userId: req.user._id,
        internshipSlug: slug,
        kind: "assignment",
        weekIndex: resolvedWeekIndex,
        classId: liveClass.id,
      },
      {
        $set: {
          answers: normalizedAnswers,
          mcqScore,
          mcqTotal,
          passingScore,
          passed,
          submittedAt: new Date(),
          githubUrl: "",
          reviewStatus: "pending",
          reviewReason: "",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Assignment submitted",
      submission: {
        answers: doc.answers,
        mcqScore: doc.mcqScore,
        mcqTotal: doc.mcqTotal,
        passed: doc.passed,
        passingScore: doc.passingScore,
        submittedAt: doc.submittedAt,
      },
      questions: questions.map((q) => mapQuestionForStudent(q, true)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};

const submitProjectGithub = async (req, res) => {
  try {
    const { slug, weekIndex: weekIndexParam } = req.params;
    const weekIndex = Number(weekIndexParam);
    const githubUrl = String(req.body.githubUrl || "").trim();

    if (!Number.isInteger(weekIndex) || weekIndex < 0) {
      return res.status(400).json({ message: "Invalid weekIndex" });
    }
    if (!githubUrl) {
      return res.status(400).json({ message: "GitHub URL is required" });
    }
    if (!/^https?:\/\/(www\.)?github\.com\//i.test(githubUrl)) {
      return res.status(400).json({
        message: "Enter a valid GitHub URL (https://github.com/...)",
      });
    }

    const enrollment = await ensureEnrolled(req.user._id, slug);
    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this program" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) return res.status(404).json({ message: "Program not found" });

    const mod = (config.modules || []).find(
      (m, index) => (m.weekIndex ?? index) === weekIndex
    );
    if (!mod || !mod.isCapstone) {
      return res.status(404).json({ message: "Project week not found" });
    }

    const anchor =
      typeof mod.assignment?.projectAnchorWeekIndex === "number"
        ? mod.assignment.projectAnchorWeekIndex
        : null;
    const resolvedWeekIndex =
      anchor != null ? anchor : mod.weekIndex ?? weekIndex;

    const doc = await InternshipWorkSubmission.findOneAndUpdate(
      {
        userId: req.user._id,
        internshipSlug: slug,
        kind: "project",
        weekIndex: resolvedWeekIndex,
        classId: null,
      },
      {
        $set: {
          githubUrl,
          answers: [],
          mcqScore: 0,
          mcqTotal: 0,
          submittedAt: new Date(),
          // New/updated submission needs trainer review again.
          reviewStatus: "pending",
          reviewReason: "",
          reviewedAt: null,
          reviewedBy: null,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      message: "Project submitted",
      submission: {
        githubUrl: doc.githubUrl,
        submittedAt: doc.submittedAt,
        reviewStatus: doc.reviewStatus || "pending",
        reviewReason: doc.reviewReason || "",
        reviewedAt: doc.reviewedAt || null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit project" });
  }
};

const markLiveClassAttendance = async (req, res) => {
  try {
    const { slug, classId: classIdParam } = req.params;
    const weekIndex = Number(req.body.weekIndex);
    const classId = String(classIdParam || req.body.classId || "").trim();

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }
    if (!Number.isInteger(weekIndex) || weekIndex < 0) {
      return res.status(400).json({ message: "weekIndex is required" });
    }

    const enrollment = await ensureEnrolled(req.user._id, slug);
    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this program" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) {
      return res.status(404).json({ message: "Program not found" });
    }

    const { liveClass, resolvedWeekIndex } = findClassInConfig(
      config,
      weekIndex,
      classId
    );
    if (!liveClass) {
      return res.status(404).json({ message: "Live class not found" });
    }
    if (!liveClass.meetingLink) {
      return res.status(400).json({
        message: "This class does not have a meeting link yet",
      });
    }

    const now = new Date();
    const window = evaluateAttendanceWindow(liveClass, now);
    const existing = await InternshipAttendance.findOne({
      userId: req.user._id,
      internshipSlug: slug,
      weekIndex: resolvedWeekIndex,
      classId: liveClass.id,
    });

    // Outside the schedule window: still allow join, but do not mark attendance.
    if (!window.canMark) {
      return res.status(200).json({
        message: window.reason || "Attendance not marked outside class hours",
        marked: false,
        attendanceOpen: false,
        reason: window.reason,
        attendance: existing
          ? {
              weekIndex: existing.weekIndex,
              classId: existing.classId,
              attended: true,
              joinedAt: existing.joinedAt,
              lastJoinedAt: existing.lastJoinedAt,
              joinCount: existing.joinCount,
            }
          : {
              weekIndex: resolvedWeekIndex,
              classId: liveClass.id,
              attended: false,
              joinedAt: null,
              lastJoinedAt: null,
              joinCount: 0,
            },
      });
    }

    let doc;
    if (existing) {
      existing.lastJoinedAt = now;
      existing.joinCount = (existing.joinCount || 1) + 1;
      await existing.save();
      doc = existing;
    } else {
      doc = await InternshipAttendance.create({
        userId: req.user._id,
        internshipSlug: slug,
        weekIndex: resolvedWeekIndex,
        classId: liveClass.id,
        joinedAt: now,
        lastJoinedAt: now,
        joinCount: 1,
      });
    }

    res.status(200).json({
      message: "Attendance marked",
      marked: true,
      attendanceOpen: true,
      attendance: {
        weekIndex: doc.weekIndex,
        classId: doc.classId,
        attended: true,
        joinedAt: doc.joinedAt,
        lastJoinedAt: doc.lastJoinedAt,
        joinCount: doc.joinCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

const getStudentCertificatePdf = async (req, res) => {
  try {
    const { slug } = req.params;
    const enrollment = await ensureEnrolled(req.user._id, slug);
    const certificates = await InternshipCertificate.find({
      userId: req.user._id,
      internshipSlug: slug,
    }).sort({ createdAt: -1 });
    const certificate =
      certificates.find((c) => c.certificateType === "internship-completion") ||
      certificates[0] ||
      null;

    if (!certificate) {
      return res.status(404).json({ message: "No certificate issued for this program yet" });
    }

    const template = await resolveCertificateTemplateForProgram(
      certificate.internshipSlug,
      certificate.certificateTemplateId
    );
    if (!template?.pdfUrl) {
      return res.status(404).json({ message: "Certificate template PDF not found" });
    }

    const { fromDate, toDate } = await resolveInternshipCertificateDates(certificate);
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

    const safeName = String(certificate.studentName || "certificate")
      .replace(/[^\w.-]+/g, "_")
      .slice(0, 80);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${safeName}_internship_certificate.pdf"`
    );
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate certificate PDF" });
  }
};

module.exports = {
  getStudentDashboard,
  submitClassAssignment,
  markLiveClassAttendance,
  submitProjectGithub,
  getStudentCertificatePdf,
};
