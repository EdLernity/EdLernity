const InternshipTrainerAssignment = require("../models/internshipTrainerAssignmentSchema");
const InternshipStudentAssignment = require("../models/internshipStudentAssignmentSchema");
const InternshipProgramConfig = require("../models/internshipProgramConfigSchema");
const { getOrCreateProgramConfig } = require("./internshipAdminController");
const { INTERNSHIP_CATALOG } = require("../utils/internshipCatalog");
const { resolveBonuses } = require("../utils/internshipConfigDefaults");

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
          coverImage: configMap[slug]?.coverImage || INTERNSHIP_CATALOG[slug]?.coverImage || "",
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
        coverImage: configMap[a.internshipSlug]?.coverImage || "",
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

    const studentQuery = {
      internshipSlug: slug,
      active: true,
    };
    if (req.userRole !== "admin") {
      studentQuery.trainerId = req.user._id;
    }

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
        bonuses: resolveBonuses(plain.bonuses),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getMyPrograms,
  getMyStudents,
  getProgramConfig,
  updateProgramConfig,
  canEditProgram,
};
