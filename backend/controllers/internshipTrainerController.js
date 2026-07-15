const InternshipTrainerAssignment = require("../models/internshipTrainerAssignmentSchema");
const InternshipStudentAssignment = require("../models/internshipStudentAssignmentSchema");
const InternshipProgramConfig = require("../models/internshipProgramConfigSchema");
const InternshipWorkSubmission = require("../models/internshipWorkSubmissionSchema");
const InternshipAttendance = require("../models/internshipAttendanceSchema");
const { getOrCreateProgramConfig } = require("./internshipAdminController");
const { INTERNSHIP_CATALOG } = require("../utils/internshipCatalog");
const { resolveBonuses } = require("../utils/internshipConfigDefaults");
const {
  normalizeModulesForEdit,
  normalizeModulesForSave,
  normalizeLiveClasses,
  normalizePassingScore,
  isAssignmentPassed,
} = require("../utils/internshipLiveClasses");
const { generateAssignmentQuestions } = require("../utils/geminiAssignmentGenerator");

function resolveProgramCoverImage(slug, configCoverImage) {
  return INTERNSHIP_CATALOG[slug]?.coverImage || configCoverImage || "";
}

const getMyPrograms = async (req, res) => {
  try {
    if (req.userRole === "admin") {
      const slugs = Object.keys(INTERNSHIP_CATALOG);
      const configs = await InternshipProgramConfig.find({
        internshipSlug: { $in: slugs },
      });
      const configMap = Object.fromEntries(
        configs.map((c) => [c.internshipSlug, c])
      );
      const studentCounts = await InternshipStudentAssignment.aggregate([
        { $match: { internshipSlug: { $in: slugs }, active: true } },
        { $group: { _id: "$internshipSlug", count: { $sum: 1 } } },
      ]);
      const countMap = Object.fromEntries(studentCounts.map((s) => [s._id, s.count]));

      return res.status(200).json({
        programs: slugs.map((slug) => ({
          slug,
          title: configMap[slug]?.title || INTERNSHIP_CATALOG[slug]?.title || slug,
          category: configMap[slug]?.category || INTERNSHIP_CATALOG[slug]?.category || "",
          coverImage: resolveProgramCoverImage(slug, configMap[slug]?.coverImage),
          studentCount: countMap[slug] || 0,
        })),
      });
    }

    const assignments = await InternshipTrainerAssignment.find({
      trainerId: req.user._id,
      active: true,
    }).sort({ createdAt: -1 });

    const slugs = assignments.map((a) => a.internshipSlug);
    const configs = await InternshipProgramConfig.find({
      internshipSlug: { $in: slugs },
    });
    const configMap = Object.fromEntries(
      configs.map((c) => [c.internshipSlug, c])
    );

    const studentCounts = await InternshipStudentAssignment.aggregate([
      { $match: { internshipSlug: { $in: slugs }, active: true } },
      { $group: { _id: "$internshipSlug", count: { $sum: 1 } } },
    ]);
    const countMap = Object.fromEntries(studentCounts.map((s) => [s._id, s.count]));

    res.status(200).json({
      programs: assignments.map((a) => ({
        slug: a.internshipSlug,
        title: configMap[a.internshipSlug]?.title || a.internshipSlug,
        category: configMap[a.internshipSlug]?.category || "",
        coverImage: resolveProgramCoverImage(a.internshipSlug, configMap[a.internshipSlug]?.coverImage),
        studentCount: countMap[a.internshipSlug] || 0,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyStudents = async (req, res) => {
  try {
    const { slug } = req.params;
    const isTrainer = await InternshipTrainerAssignment.findOne({
      trainerId: req.user._id,
      internshipSlug: slug,
      active: true,
    });
    if (!isTrainer && req.userRole !== "admin") {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    const studentQuery = studentScopeQuery(req.user._id, req.userRole, slug);

    const students = await InternshipStudentAssignment.find(studentQuery).populate("studentId", "firstName lastName email phone");

    res.status(200).json({
      students: students.map((s) => ({
        id: s.studentId?._id,
        name: `${s.studentId?.firstName || ""} ${s.studentId?.lastName || ""}`.trim(),
        email: s.studentId?.email,
        phone: s.studentId?.phone,
        assignedAt: s.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const canEditProgram = async (userId, userRole, slug) => {
  if (userRole === "admin") return true;
  const assignment = await InternshipTrainerAssignment.findOne({
    trainerId: userId,
    internshipSlug: slug,
    active: true,
  });
  return Boolean(assignment);
};

/**
 * Students enrolled in a program the trainer owns.
 * Include: assigned to this trainer, or unassigned (trainerId null).
 * Exclude: assigned to a different trainer when multi-trainer splits are used.
 * Enrollment often leaves trainerId null, so those must still be visible.
 */
function studentScopeQuery(userId, userRole, internshipSlugFilter) {
  const query = {
    internshipSlug: internshipSlugFilter,
    active: true,
  };
  if (userRole !== "admin") {
    query.$or = [
      { trainerId: userId },
      { trainerId: null },
      { trainerId: { $exists: false } },
    ];
  }
  return query;
}

const getProgramConfig = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }
    const config = await getOrCreateProgramConfig(slug);
    if (!config) return res.status(404).json({ message: "Program not found" });
    const plain = config.toObject();
    res.status(200).json({
      config: {
        ...plain,
        modules: normalizeModulesForEdit(plain.modules || []),
        bonuses: resolveBonuses(plain.bonuses),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateProgramConfig = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    const allowed = [
      "syllabusNote",
      "liveSchedule",
      "announcements",
      "bonuses",
      "modules",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });
    if (updates.modules) {
      updates.modules = normalizeModulesForSave(updates.modules);
    }
    updates.updatedBy = req.user._id;

    const config = await InternshipProgramConfig.findOneAndUpdate(
      { internshipSlug: slug },
      { $set: updates },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const plain = config.toObject();
    res.status(200).json({
      message: "Program updated",
      config: {
        ...plain,
        modules: normalizeModulesForEdit(plain.modules || []),
        bonuses: resolveBonuses(plain.bonuses),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const generateClassQuestions = async (req, res) => {
  try {
    const { slug, classId } = req.params;
    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    const weekIndex = Number(req.body.weekIndex);
    if (!Number.isInteger(weekIndex) || weekIndex < 0) {
      return res.status(400).json({ message: "weekIndex is required" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) return res.status(404).json({ message: "Program not found" });

    const mod = (config.modules || []).find(
      (m, index) => (m.weekIndex ?? index) === weekIndex
    );
    if (!mod) return res.status(404).json({ message: "Week not found" });

    const classes = normalizeLiveClasses(mod);
    const liveClass = classes.find((c) => c.id === classId) || classes[Number(classId)];
    if (!liveClass) return res.status(404).json({ message: "Class not found" });

    const pdfFile = req.file || null;
    if (pdfFile) {
      const isPdf =
        pdfFile.mimetype === "application/pdf" ||
        /\.pdf$/i.test(pdfFile.originalname || "");
      if (!isPdf) {
        return res.status(400).json({ message: "Only PDF uploads are supported for context" });
      }
    }

    const questions = await generateAssignmentQuestions({
      programTitle: config.title || INTERNSHIP_CATALOG[slug]?.title || slug,
      weekLabel: mod.week,
      weekTopic: mod.topic,
      classTitle: liveClass.title,
      scheduleDay: liveClass.scheduleDay,
      scheduleTime: liveClass.scheduleTime,
      numMcq: req.body.numMcq,
      numText: 0,
      difficulty: req.body.difficulty || "medium",
      focus: req.body.focus || "",
      contextText: req.body.contextText || "",
      pdfBuffer: pdfFile?.buffer || null,
      pdfMimeType: pdfFile?.mimetype || "application/pdf",
    });

    res.status(200).json({
      questions,
      classId: liveClass.id,
      weekIndex,
      usedContext: {
        hasText: Boolean(String(req.body.contextText || "").trim()),
        hasPdf: Boolean(pdfFile),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).json({
      message: err.message || "Failed to generate questions",
    });
  }
};

function buildExpectedWork(modules = []) {
  const assignments = [];
  const projects = [];

  (modules || []).forEach((mod, index) => {
    const weekIndex = mod.weekIndex ?? index;
    if (mod.isCapstone) {
      const anchor = mod.assignment?.projectAnchorWeekIndex;
      // Secondary weeks in a multi-week project are not separate submissions.
      if (typeof anchor === "number" && anchor !== weekIndex) {
        return;
      }
      const spanWeeks = Math.min(
        3,
        Math.max(1, Number(mod.assignment?.spanWeeks) || 1)
      );
      projects.push({
        key: `project:${weekIndex}`,
        kind: "project",
        weekIndex,
        weekLabel: mod.week || `Week ${weekIndex + 1}`,
        topic: mod.topic || "",
        title: mod.assignment?.title || `${mod.week || "Week"} Project`,
        documentUrl: mod.assignment?.documentUrl || "",
        documentTitle: mod.assignment?.documentTitle || "",
        spanWeeks,
      });
      return;
    }

    const classes = normalizeLiveClasses(mod);
    classes.forEach((liveClass, classIndex) => {
      const questions = liveClass.assignment?.questions || [];
      const hasWork =
        questions.length > 0 ||
        Boolean(liveClass.assignment?.title || liveClass.assignment?.instructions);
      if (!hasWork) return;
      assignments.push({
        key: `assignment:${weekIndex}:${liveClass.id}`,
        kind: "assignment",
        weekIndex,
        classId: liveClass.id,
        classIndex,
        weekLabel: mod.week || `Week ${weekIndex + 1}`,
        topic: mod.topic || "",
        classTitle: liveClass.title || `Class ${classIndex + 1}`,
        title: liveClass.assignment?.title || liveClass.title || "Assignment",
        questionCount: questions.length,
        passingScore: normalizePassingScore(liveClass.assignment?.passingScore),
      });
    });
  });

  return { assignments, projects };
}

function buildExpectedLiveClasses(modules = []) {
  const classes = [];
  (modules || []).forEach((mod, index) => {
    const weekIndex = mod.weekIndex ?? index;
    normalizeLiveClasses(mod).forEach((liveClass) => {
      if (!liveClass.meetingLink && !liveClass.recordingUrl) return;
      classes.push({
        key: `class:${weekIndex}:${liveClass.id}`,
        weekIndex,
        classId: liveClass.id,
        weekLabel: mod.week || `Week ${weekIndex + 1}`,
        title: liveClass.title || "Live class",
        meetingLink: liveClass.meetingLink || "",
      });
    });
  });
  return classes;
}

const getProgramProgress = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) return res.status(404).json({ message: "Program not found" });

    const studentQuery = studentScopeQuery(req.user._id, req.userRole, slug);

    const studentRows = await InternshipStudentAssignment.find(studentQuery)
      .populate("studentId", "firstName lastName email phone")
      .lean();

    const studentIds = studentRows
      .map((s) => s.studentId?._id)
      .filter(Boolean);

    const [submissions, attendanceRows] = studentIds.length
      ? await Promise.all([
          InternshipWorkSubmission.find({
            internshipSlug: slug,
            userId: { $in: studentIds },
          }).lean(),
          InternshipAttendance.find({
            internshipSlug: slug,
            userId: { $in: studentIds },
          }).lean(),
        ])
      : [[], []];

    const submissionMap = {};
    for (const row of submissions) {
      const uid = String(row.userId);
      const classKey = row.classId == null ? "" : row.classId;
      submissionMap[`${uid}:${row.kind}:${row.weekIndex}:${classKey}`] = row;
    }

    const attendanceMap = {};
    for (const row of attendanceRows) {
      attendanceMap[`${row.userId}:${row.weekIndex}:${row.classId}`] = row;
    }

    const expected = buildExpectedWork(config.modules || []);
    const expectedClasses = buildExpectedLiveClasses(config.modules || []);
    const totalAssignments = expected.assignments.length;
    const totalProjects = expected.projects.length;
    const totalClasses = expectedClasses.length;

    const students = studentRows.map((row) => {
      const user = row.studentId || {};
      const userId = String(user._id || "");
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
      const email = user.email || "";

      const assignmentResults = expected.assignments.map((item) => {
        const sub =
          submissionMap[`${userId}:assignment:${item.weekIndex}:${item.classId}`] ||
          null;
        const submitted = Boolean(sub);
        const passingScore = normalizePassingScore(item.passingScore);
        const mcqScore = sub?.mcqScore ?? null;
        const mcqTotal = sub?.mcqTotal ?? null;
        const passed = submitted
          ? isAssignmentPassed(mcqScore, mcqTotal, passingScore)
          : null;
        return {
          key: item.key,
          weekIndex: item.weekIndex,
          classId: item.classId,
          title: item.title,
          weekLabel: item.weekLabel,
          classTitle: item.classTitle,
          submitted,
          submittedAt: sub?.submittedAt || null,
          mcqScore,
          mcqTotal,
          passingScore,
          passed,
          status: !submitted ? "pending" : passed ? "passed" : "failed",
        };
      });

      const projectResults = expected.projects.map((item) => {
        const sub = submissionMap[`${userId}:project:${item.weekIndex}:`] || null;
        const submitted = Boolean(sub?.githubUrl);
        const reviewStatus = submitted
          ? sub?.reviewStatus || "pending"
          : null;
        return {
          key: item.key,
          weekIndex: item.weekIndex,
          title: item.title,
          weekLabel: item.weekLabel,
          topic: item.topic,
          submitted,
          submittedAt: sub?.submittedAt || null,
          githubUrl: sub?.githubUrl || "",
          reviewStatus,
          reviewReason: sub?.reviewReason || "",
          reviewedAt: sub?.reviewedAt || null,
          approved: reviewStatus === "approved",
        };
      });

      const attendanceResults = expectedClasses.map((item) => {
        const att =
          attendanceMap[`${userId}:${item.weekIndex}:${item.classId}`] || null;
        return {
          key: item.key,
          weekIndex: item.weekIndex,
          classId: item.classId,
          title: item.title,
          weekLabel: item.weekLabel,
          attended: Boolean(att),
          joinedAt: att?.joinedAt || null,
          lastJoinedAt: att?.lastJoinedAt || null,
          joinCount: att?.joinCount || 0,
        };
      });

      const assignmentsDone = assignmentResults.filter((a) => a.passed).length;
      const assignmentsSubmitted = assignmentResults.filter((a) => a.submitted).length;
      const projectsDone = projectResults.filter((p) => p.approved).length;
      const projectsSubmitted = projectResults.filter((p) => p.submitted).length;
      const attendanceDone = attendanceResults.filter((a) => a.attended).length;
      const internshipCompleted = Boolean(row.internshipCompleted);
      const hasWork = totalAssignments > 0 || totalProjects > 0;
      const eligibleForCompletion =
        !internshipCompleted &&
        hasWork &&
        assignmentsDone === totalAssignments &&
        projectsDone === totalProjects;

      return {
        id: userId,
        name,
        email,
        phone: user.phone || "",
        assignedAt: row.createdAt,
        assignmentsDone,
        assignmentsSubmitted,
        assignmentsTotal: totalAssignments,
        projectsDone,
        projectsSubmitted,
        projectsTotal: totalProjects,
        attendanceDone,
        attendanceTotal: totalClasses,
        assignmentCompletionPercent: totalAssignments
          ? Math.round((assignmentsDone / totalAssignments) * 100)
          : 0,
        projectCompletionPercent: totalProjects
          ? Math.round((projectsDone / totalProjects) * 100)
          : 0,
        internshipCompleted,
        internshipCompletedAt: row.internshipCompletedAt || null,
        internshipCompletedOverride: Boolean(row.internshipCompletedOverride),
        eligibleForCompletion,
        assignments: assignmentResults,
        projects: projectResults,
        attendance: attendanceResults,
      };
    });

    const fullyCompleteAssignments = students.filter(
      (s) => s.assignmentsTotal > 0 && s.assignmentsDone === s.assignmentsTotal
    ).length;
    const fullyCompleteProjects = students.filter(
      (s) => s.projectsTotal > 0 && s.projectsDone === s.projectsTotal
    ).length;
    const internshipCompletedCount = students.filter(
      (s) => s.internshipCompleted
    ).length;
    const eligibleCount = students.filter((s) => s.eligibleForCompletion).length;

    res.status(200).json({
      summary: {
        studentCount: students.length,
        assignmentCount: totalAssignments,
        projectCount: totalProjects,
        studentsWithAllAssignments: fullyCompleteAssignments,
        studentsWithAllProjects: fullyCompleteProjects,
        internshipCompletedCount,
        eligibleForCompletionCount: eligibleCount,
      },
      expected: {
        assignments: expected.assignments,
        projects: expected.projects,
      },
      students,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load progress tracking" });
  }
};

const reviewProjectSubmission = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    const studentId = String(req.body.studentId || "");
    const weekIndex = Number(req.body.weekIndex);
    const decision = String(req.body.status || "").toLowerCase();
    const reason = String(req.body.reason || "").trim();

    if (!studentId || !Number.isInteger(weekIndex) || weekIndex < 0) {
      return res.status(400).json({
        message: "studentId and weekIndex are required",
      });
    }
    if (!["approved", "rejected", "pending"].includes(decision)) {
      return res.status(400).json({
        message: "status must be approved, rejected, or pending (revert)",
      });
    }
    if (decision === "rejected" && reason.length < 5) {
      return res.status(400).json({
        message: "Please explain what needs improvement (at least 5 characters)",
      });
    }

    const enrollment = await InternshipStudentAssignment.findOne({
      ...studentScopeQuery(req.user._id, req.userRole, slug),
      studentId,
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Student not found in this program" });
    }
    if (enrollment.internshipCompleted) {
      return res.status(400).json({
        message:
          "Internship already marked completed for this student. Reopen completion before changing project review.",
      });
    }

    const submission = await InternshipWorkSubmission.findOne({
      userId: studentId,
      internshipSlug: slug,
      kind: "project",
      weekIndex,
    });
    if (!submission || !submission.githubUrl) {
      return res.status(404).json({ message: "No project submission found" });
    }

    submission.reviewStatus = decision;
    submission.reviewReason = decision === "rejected" ? reason : "";
    if (decision === "pending") {
      submission.reviewedAt = null;
      submission.reviewedBy = null;
    } else {
      submission.reviewedAt = new Date();
      submission.reviewedBy = req.user._id;
    }
    await submission.save();

    const messages = {
      approved: "Project approved",
      rejected: "Project rejected",
      pending: "Project review reverted to awaiting review",
    };

    res.status(200).json({
      message: messages[decision] || "Project review updated",
      project: {
        weekIndex,
        studentId,
        githubUrl: submission.githubUrl,
        reviewStatus: submission.reviewStatus,
        reviewReason: submission.reviewReason,
        reviewedAt: submission.reviewedAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to review project" });
  }
};

async function computeStudentEligibility(
  slug,
  studentId,
  trainerId,
  userRole,
  { override = false } = {}
) {
  const enrollment = await InternshipStudentAssignment.findOne({
    ...studentScopeQuery(trainerId, userRole, slug),
    studentId,
  }).lean();
  if (!enrollment) return { ok: false, status: 404, message: "Student not found" };
  if (enrollment.internshipCompleted) {
    return { ok: false, status: 400, message: "Internship already marked completed" };
  }

  const config = await getOrCreateProgramConfig(slug);
  if (!config) return { ok: false, status: 404, message: "Program not found" };

  const expected = buildExpectedWork(config.modules || []);
  if (!expected.assignments.length && !expected.projects.length) {
    return {
      ok: false,
      status: 400,
      message: "Program has no assignments or projects to complete",
    };
  }

  if (override) {
    return { ok: true, enrollment, override: true };
  }

  const submissions = await InternshipWorkSubmission.find({
    userId: studentId,
    internshipSlug: slug,
  }).lean();
  const submissionMap = {};
  for (const row of submissions) {
    const classKey = row.classId == null ? "" : row.classId;
    submissionMap[`${row.kind}:${row.weekIndex}:${classKey}`] = row;
  }

  for (const item of expected.assignments) {
    const sub = submissionMap[`assignment:${item.weekIndex}:${item.classId}`];
    if (!sub) {
      return {
        ok: false,
        status: 400,
        message: "Student has not passed all assignments yet",
      };
    }
    const passed = isAssignmentPassed(
      sub.mcqScore,
      sub.mcqTotal,
      item.passingScore || 8
    );
    if (!passed) {
      return {
        ok: false,
        status: 400,
        message: "Student has not passed all assignments yet",
      };
    }
  }

  for (const item of expected.projects) {
    const sub = submissionMap[`project:${item.weekIndex}:`];
    if (!sub?.githubUrl || sub.reviewStatus !== "approved") {
      return {
        ok: false,
        status: 400,
        message: "All projects must be approved before completing the internship",
      };
    }
  }

  return { ok: true, enrollment, override: false };
}

const completeInternship = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    const studentId = String(req.body.studentId || "");
    const override = Boolean(req.body.override);
    if (!studentId) {
      return res.status(400).json({ message: "studentId is required" });
    }

    const check = await computeStudentEligibility(
      slug,
      studentId,
      req.user._id,
      req.userRole,
      { override }
    );
    if (!check.ok) {
      return res.status(check.status).json({ message: check.message });
    }

    const updated = await InternshipStudentAssignment.findOneAndUpdate(
      { studentId, internshipSlug: slug, active: true },
      {
        $set: {
          internshipCompleted: true,
          internshipCompletedAt: new Date(),
          internshipCompletedBy: req.user._id,
          internshipCompletedOverride: Boolean(check.override),
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: check.override
        ? "Internship marked as completed (trainer override)"
        : "Internship marked as completed",
      student: {
        id: studentId,
        internshipCompleted: true,
        internshipCompletedAt: updated.internshipCompletedAt,
        internshipCompletedOverride: Boolean(updated.internshipCompletedOverride),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete internship" });
  }
};

const completeInternshipBulk = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    const studentIds = Array.isArray(req.body.studentIds)
      ? req.body.studentIds.map(String).filter(Boolean)
      : [];
    const override = Boolean(req.body.override);
    if (!studentIds.length) {
      return res.status(400).json({ message: "studentIds are required" });
    }

    const completed = [];
    const skipped = [];

    for (const studentId of studentIds) {
      const check = await computeStudentEligibility(
        slug,
        studentId,
        req.user._id,
        req.userRole,
        { override }
      );
      if (!check.ok) {
        skipped.push({ studentId, reason: check.message });
        continue;
      }
      const updated = await InternshipStudentAssignment.findOneAndUpdate(
        { studentId, internshipSlug: slug, active: true },
        {
          $set: {
            internshipCompleted: true,
            internshipCompletedAt: new Date(),
            internshipCompletedBy: req.user._id,
            internshipCompletedOverride: Boolean(check.override),
          },
        },
        { new: true }
      );
      completed.push({
        studentId,
        internshipCompletedAt: updated.internshipCompletedAt,
        internshipCompletedOverride: Boolean(updated.internshipCompletedOverride),
      });
    }

    res.status(200).json({
      message: `Completed ${completed.length} internship(s)`,
      completed,
      skipped,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to bulk-complete internships" });
  }
};

async function resolveTrainerProgramSlugs(userId, userRole) {
  if (userRole === "admin") {
    return Object.keys(INTERNSHIP_CATALOG);
  }
  const rows = await InternshipTrainerAssignment.find({
    trainerId: userId,
    active: true,
  }).lean();
  return rows.map((row) => row.internshipSlug);
}

const getAssessments = async (req, res) => {
  try {
    const allowedSlugs = await resolveTrainerProgramSlugs(req.user._id, req.userRole);
    const requestedSlug = String(req.query.slug || "").trim();
    const status = String(req.query.status || "all").toLowerCase();
    const classKey = String(req.query.classKey || "").trim();
    const search = String(req.query.q || "").trim().toLowerCase();

    const slugs = requestedSlug
      ? allowedSlugs.filter((slug) => slug === requestedSlug)
      : allowedSlugs;

    if (requestedSlug && !allowedSlugs.includes(requestedSlug)) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    if (!slugs.length) {
      return res.status(200).json({
        programs: [],
        classes: [],
        summary: { total: 0, submitted: 0, pending: 0 },
        rows: [],
      });
    }

    const configs = await InternshipProgramConfig.find({
      internshipSlug: { $in: slugs },
    }).lean();
    const configMap = Object.fromEntries(
      configs.map((c) => [c.internshipSlug, c])
    );

    const studentQuery = studentScopeQuery(req.user._id, req.userRole, {
      $in: slugs,
    });

    const studentRows = await InternshipStudentAssignment.find(studentQuery)
      .populate("studentId", "firstName lastName email phone")
      .lean();

    const studentIds = studentRows
      .map((s) => s.studentId?._id)
      .filter(Boolean);

    const submissions = studentIds.length
      ? await InternshipWorkSubmission.find({
          internshipSlug: { $in: slugs },
          userId: { $in: studentIds },
          kind: "assignment",
        }).lean()
      : [];

    const submissionMap = {};
    for (const row of submissions) {
      const uid = String(row.userId);
      submissionMap[`${uid}:${row.internshipSlug}:${row.weekIndex}:${row.classId || ""}`] =
        row;
    }

    const classOptions = [];
    const rows = [];
    const programStats = {};

    for (const slug of slugs) {
      const config = configMap[slug];
      const catalog = INTERNSHIP_CATALOG[slug] || {};
      const programTitle =
        config?.title || catalog.title || slug;
      const expected = buildExpectedWork(config?.modules || []);
      const studentsForSlug = studentRows.filter(
        (row) => row.internshipSlug === slug
      );
      const studentCount = studentsForSlug.length;
      const assignmentCount = expected.assignments.length;
      let submittedCount = 0;

      programStats[slug] = {
        slug,
        title: programTitle,
        category: config?.category || catalog.category || "",
        coverImage: resolveProgramCoverImage(slug, config?.coverImage),
        studentCount,
        assignmentCount,
        submissionTotal: studentCount * assignmentCount,
        submittedCount: 0,
        pendingCount: 0,
        completionPercent: 0,
      };

      for (const item of expected.assignments) {
        const optionKey = `${slug}:${item.weekIndex}:${item.classId}`;
        classOptions.push({
          key: optionKey,
          slug,
          programTitle,
          weekIndex: item.weekIndex,
          weekLabel: item.weekLabel,
          topic: item.topic || "",
          classId: item.classId,
          classTitle: item.classTitle,
          assignmentTitle: item.title,
          questionCount: item.questionCount || 0,
        });
      }

      for (const studentRow of studentsForSlug) {
        const user = studentRow.studentId || {};
        const userId = String(user._id || "");
        if (!userId) continue;
        const studentName =
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
        const studentEmail = user.email || "";

        for (const item of expected.assignments) {
          const sub =
            submissionMap[
              `${userId}:${slug}:${item.weekIndex}:${item.classId}`
            ] || null;
          const submitted = Boolean(sub);
          if (submitted) submittedCount += 1;
          const passingScore = normalizePassingScore(item.passingScore);
          const passed = submitted
            ? isAssignmentPassed(sub?.mcqScore, sub?.mcqTotal, passingScore)
            : null;
          rows.push({
            id: `${userId}:${slug}:${item.weekIndex}:${item.classId}`,
            internshipSlug: slug,
            programTitle,
            studentId: userId,
            studentName,
            studentEmail,
            phone: user.phone || "",
            weekIndex: item.weekIndex,
            weekLabel: item.weekLabel,
            topic: item.topic || "",
            classId: item.classId,
            classTitle: item.classTitle,
            assignmentTitle: item.title,
            questionCount: item.questionCount || 0,
            submitted,
            submittedAt: sub?.submittedAt || null,
            mcqScore: submitted ? sub?.mcqScore ?? null : null,
            mcqTotal: submitted ? sub?.mcqTotal ?? null : null,
            passingScore,
            passed,
            status: !submitted ? "pending" : passed ? "passed" : "failed",
          });
        }
      }

      const totalSlots = studentCount * assignmentCount;
      programStats[slug].submittedCount = submittedCount;
      programStats[slug].pendingCount = Math.max(0, totalSlots - submittedCount);
      programStats[slug].completionPercent = totalSlots
        ? Math.round((submittedCount / totalSlots) * 100)
        : 0;
    }

    const programs = slugs.map((slug) => programStats[slug]).filter(Boolean);

    let filtered = rows;
    if (classKey) {
      filtered = filtered.filter(
        (row) =>
          `${row.internshipSlug}:${row.weekIndex}:${row.classId}` === classKey
      );
    }
    if (status === "submitted") {
      filtered = filtered.filter((row) => row.submitted);
    } else if (status === "pending") {
      filtered = filtered.filter((row) => !row.submitted);
    }
    if (search) {
      filtered = filtered.filter((row) => {
        const hay =
          `${row.studentName} ${row.studentEmail} ${row.phone} ${row.assignmentTitle} ${row.classTitle} ${row.programTitle}`.toLowerCase();
        return hay.includes(search);
      });
    }

    filtered.sort((a, b) => {
      if (a.submitted !== b.submitted) return a.submitted ? -1 : 1;
      const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return bTime - aTime;
    });

    const submittedCount = filtered.filter((row) => row.submitted).length;

    res.status(200).json({
      programs,
      classes: classOptions,
      summary: {
        total: filtered.length,
        submitted: submittedCount,
        pending: filtered.length - submittedCount,
      },
      rows: filtered,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load assessments" });
  }
};

const getAssessmentDetail = async (req, res) => {
  try {
    const slug = String(req.params.slug || "");
    const studentId = String(req.query.studentId || "");
    const classId = String(req.query.classId || "");
    const weekIndex = Number(req.query.weekIndex);

    if (!(await canEditProgram(req.user._id, req.userRole, slug))) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }
    if (!studentId || !classId || !Number.isInteger(weekIndex) || weekIndex < 0) {
      return res.status(400).json({
        message: "studentId, weekIndex, and classId are required",
      });
    }

    const enrollment = await InternshipStudentAssignment.findOne({
      ...studentScopeQuery(req.user._id, req.userRole, slug),
      studentId,
    })
      .populate("studentId", "firstName lastName email phone")
      .lean();
    if (!enrollment) {
      return res.status(404).json({ message: "Student not found in this program" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) return res.status(404).json({ message: "Program not found" });

    const modules = config.modules || [];
    const mod = modules.find((m, index) => (m.weekIndex ?? index) === weekIndex);
    if (!mod || mod.isCapstone) {
      return res.status(404).json({ message: "Assignment week not found" });
    }
    const liveClasses = normalizeLiveClasses(mod);
    const liveClass = liveClasses.find((c) => c.id === classId);
    if (!liveClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    const assignment = liveClass.assignment || {};
    const questions = Array.isArray(assignment.questions) ? assignment.questions : [];
    const submission = await InternshipWorkSubmission.findOne({
      userId: studentId,
      internshipSlug: slug,
      kind: "assignment",
      weekIndex,
      classId,
    }).lean();

    const answerById = Object.fromEntries(
      (submission?.answers || []).map((a) => [a.questionId, a])
    );

    const user = enrollment.studentId || {};
    const studentName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";

    res.status(200).json({
      internshipSlug: slug,
      programTitle: config.title || INTERNSHIP_CATALOG[slug]?.title || slug,
      student: {
        id: String(user._id || studentId),
        name: studentName,
        email: user.email || "",
        phone: user.phone || "",
      },
      assignment: {
        weekIndex,
        weekLabel: mod.week || `Week ${weekIndex + 1}`,
        topic: mod.topic || "",
        classId,
        classTitle: liveClass.title || "Class",
        title: assignment.title || liveClass.title || "Assignment",
        instructions: assignment.instructions || "",
        dueLabel: assignment.dueLabel || "",
      },
      submitted: Boolean(submission),
      submittedAt: submission?.submittedAt || null,
      mcqScore: submission?.mcqScore ?? null,
      mcqTotal: submission?.mcqTotal ?? null,
      passingScore: normalizePassingScore(assignment.passingScore),
      passed: submission
        ? isAssignmentPassed(
            submission.mcqScore,
            submission.mcqTotal,
            assignment.passingScore
          )
        : null,
      questions: questions.map((q, index) => {
        const answer = answerById[q.id] || {};
        const selectedIndex =
          typeof answer.selectedIndex === "number" ? answer.selectedIndex : null;
        const isMcq = q.type !== "text";
        return {
          id: q.id || `q-${index + 1}`,
          type: isMcq ? "mcq" : "text",
          prompt: q.prompt || "",
          options: Array.isArray(q.options) ? q.options : [],
          correctOptionIndex:
            typeof q.correctOptionIndex === "number" ? q.correctOptionIndex : 0,
          selectedIndex,
          textAnswer: answer.textAnswer || "",
          isCorrect: isMcq
            ? selectedIndex !== null && selectedIndex === q.correctOptionIndex
            : null,
        };
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load assessment detail" });
  }
};

const getProjectAssessments = async (req, res) => {
  try {
    const allowedSlugs = await resolveTrainerProgramSlugs(req.user._id, req.userRole);
    const requestedSlug = String(req.query.slug || "").trim();
    const status = String(req.query.status || "all").toLowerCase();
    const projectKey = String(req.query.projectKey || "").trim();
    const search = String(req.query.q || "").trim().toLowerCase();

    const slugs = requestedSlug
      ? allowedSlugs.filter((slug) => slug === requestedSlug)
      : allowedSlugs;

    if (requestedSlug && !allowedSlugs.includes(requestedSlug)) {
      return res.status(403).json({ message: "Not assigned to this program" });
    }

    if (!slugs.length) {
      return res.status(200).json({
        programs: [],
        projects: [],
        summary: {
          total: 0,
          submitted: 0,
          pending: 0,
          awaitingReview: 0,
          approved: 0,
          rejected: 0,
        },
        rows: [],
      });
    }

    const configs = await InternshipProgramConfig.find({
      internshipSlug: { $in: slugs },
    }).lean();
    const configMap = Object.fromEntries(
      configs.map((c) => [c.internshipSlug, c])
    );

    const studentQuery = studentScopeQuery(req.user._id, req.userRole, {
      $in: slugs,
    });
    const studentRows = await InternshipStudentAssignment.find(studentQuery)
      .populate("studentId", "firstName lastName email phone")
      .lean();

    const studentIds = studentRows
      .map((s) => s.studentId?._id)
      .filter(Boolean);

    const submissions = studentIds.length
      ? await InternshipWorkSubmission.find({
          internshipSlug: { $in: slugs },
          userId: { $in: studentIds },
          kind: "project",
        }).lean()
      : [];

    const submissionMap = {};
    for (const row of submissions) {
      const uid = String(row.userId);
      submissionMap[`${uid}:${row.internshipSlug}:${row.weekIndex}`] = row;
    }

    const projectOptions = [];
    const rows = [];
    const programStats = {};

    for (const slug of slugs) {
      const config = configMap[slug];
      const catalog = INTERNSHIP_CATALOG[slug] || {};
      const programTitle = config?.title || catalog.title || slug;
      const expected = buildExpectedWork(config?.modules || []);
      const studentsForSlug = studentRows.filter(
        (row) => row.internshipSlug === slug
      );
      const studentCount = studentsForSlug.length;
      const projectCount = expected.projects.length;

      let submittedCount = 0;
      let approvedCount = 0;
      let awaitingReviewCount = 0;
      let rejectedCount = 0;

      programStats[slug] = {
        slug,
        title: programTitle,
        category: config?.category || catalog.category || "",
        coverImage: resolveProgramCoverImage(slug, config?.coverImage),
        studentCount,
        projectCount,
        submissionTotal: studentCount * projectCount,
        submittedCount: 0,
        pendingCount: 0,
        approvedCount: 0,
        awaitingReviewCount: 0,
        rejectedCount: 0,
        completionPercent: 0,
      };

      for (const item of expected.projects) {
        projectOptions.push({
          key: `${slug}:${item.weekIndex}`,
          slug,
          programTitle,
          weekIndex: item.weekIndex,
          weekLabel: item.weekLabel,
          topic: item.topic || "",
          title: item.title,
          documentUrl: item.documentUrl || "",
          documentTitle: item.documentTitle || "",
          spanWeeks: item.spanWeeks || 1,
        });
      }

      for (const studentRow of studentsForSlug) {
        const user = studentRow.studentId || {};
        const userId = String(user._id || "");
        if (!userId) continue;
        const studentName =
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
        const studentEmail = user.email || "";

        for (const item of expected.projects) {
          const sub =
            submissionMap[`${userId}:${slug}:${item.weekIndex}`] || null;
          const submitted = Boolean(sub?.githubUrl);
          const reviewStatus = submitted
            ? sub.reviewStatus || "pending"
            : null;
          if (submitted) {
            submittedCount += 1;
            if (reviewStatus === "approved") approvedCount += 1;
            else if (reviewStatus === "rejected") rejectedCount += 1;
            else awaitingReviewCount += 1;
          }
          rows.push({
            id: `${userId}:${slug}:${item.weekIndex}`,
            internshipSlug: slug,
            programTitle,
            studentId: userId,
            studentName,
            studentEmail,
            phone: user.phone || "",
            weekIndex: item.weekIndex,
            weekLabel: item.weekLabel,
            topic: item.topic || "",
            title: item.title,
            documentUrl: item.documentUrl || "",
            documentTitle: item.documentTitle || "",
            spanWeeks: item.spanWeeks || 1,
            submitted,
            submittedAt: sub?.submittedAt || null,
            githubUrl: sub?.githubUrl || "",
            reviewStatus,
            reviewReason: sub?.reviewReason || "",
            reviewedAt: sub?.reviewedAt || null,
            approved: reviewStatus === "approved",
          });
        }
      }

      const totalSlots = studentCount * projectCount;
      const pendingCount = Math.max(0, totalSlots - submittedCount);
      programStats[slug].submittedCount = submittedCount;
      programStats[slug].pendingCount = pendingCount;
      programStats[slug].approvedCount = approvedCount;
      programStats[slug].awaitingReviewCount = awaitingReviewCount;
      programStats[slug].rejectedCount = rejectedCount;
      programStats[slug].completionPercent = totalSlots
        ? Math.round((approvedCount / totalSlots) * 100)
        : 0;
    }

    const programs = slugs.map((slug) => programStats[slug]).filter(Boolean);

    let filtered = rows;
    if (projectKey) {
      filtered = filtered.filter(
        (row) => `${row.internshipSlug}:${row.weekIndex}` === projectKey
      );
    }
    if (status === "submitted") {
      filtered = filtered.filter((row) => row.submitted);
    } else if (status === "pending") {
      filtered = filtered.filter((row) => !row.submitted);
    } else if (status === "awaiting_review") {
      filtered = filtered.filter(
        (row) => row.submitted && row.reviewStatus === "pending"
      );
    } else if (status === "approved") {
      filtered = filtered.filter((row) => row.reviewStatus === "approved");
    } else if (status === "rejected") {
      filtered = filtered.filter((row) => row.reviewStatus === "rejected");
    }
    if (search) {
      filtered = filtered.filter((row) => {
        const hay =
          `${row.studentName} ${row.studentEmail} ${row.phone} ${row.title} ${row.weekLabel} ${row.programTitle}`.toLowerCase();
        return hay.includes(search);
      });
    }

    filtered.sort((a, b) => {
      const rank = (row) => {
        if (!row.submitted) return 3;
        if (row.reviewStatus === "pending") return 0;
        if (row.reviewStatus === "rejected") return 1;
        return 2;
      };
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      const aTime = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const bTime = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return bTime - aTime;
    });

    const submitted = filtered.filter((row) => row.submitted).length;
    const awaitingReview = filtered.filter(
      (row) => row.submitted && row.reviewStatus === "pending"
    ).length;
    const approved = filtered.filter(
      (row) => row.reviewStatus === "approved"
    ).length;
    const rejected = filtered.filter(
      (row) => row.reviewStatus === "rejected"
    ).length;

    res.status(200).json({
      programs,
      projects: projectOptions,
      summary: {
        total: filtered.length,
        submitted,
        pending: filtered.length - submitted,
        awaitingReview,
        approved,
        rejected,
      },
      rows: filtered,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load project assessments" });
  }
};

module.exports = {
  getMyPrograms,
  getMyStudents,
  getProgramConfig,
  updateProgramConfig,
  generateClassQuestions,
  getProgramProgress,
  getAssessments,
  getAssessmentDetail,
  getProjectAssessments,
  reviewProjectSubmission,
  completeInternship,
  completeInternshipBulk,
  canEditProgram,
};
