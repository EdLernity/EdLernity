const UserModel = require("../models/userModel");
const UserInternship = require("../models/userInternshipSchema");
const InternshipTrainerAssignment = require("../models/internshipTrainerAssignmentSchema");
const InternshipStudentAssignment = require("../models/internshipStudentAssignmentSchema");
const InternshipProgramConfig = require("../models/internshipProgramConfigSchema");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const { INTERNSHIP_CATALOG, getInternshipBySlug, listCatalogPrograms, listCareersProgramsAsync, resolveProgramTitle } = require("../utils/internshipCatalog");
const { buildDefaultProgramConfig } = require("../utils/internshipConfigDefaults");
const { enrollInternshipRecord } = require("./controller.enroll");
const { generateUniqueCertificateId } = require("../utils/certificateIdGenerator");
const { resolveCertificateTemplateForProgram } = require("../utils/programTemplateService");

async function findUserByEmail(email) {
  return UserModel.findOne({ email: email.trim().toLowerCase() });
}

async function getOrCreateProgramConfig(slug) {
  let config = await InternshipProgramConfig.findOne({ internshipSlug: slug });
  if (!config) {
    const defaults = buildDefaultProgramConfig(slug);
    if (!defaults) return null;
    config = await InternshipProgramConfig.create(defaults);
  }
  return config;
}

const listPrograms = async (req, res) => {
  try {
    const { track } = req.query;
    let programs = listCatalogPrograms();
    if (track === "careers") {
      programs = await listCareersProgramsAsync();
    } else if (track === "paid-tech") {
      programs = programs.filter((p) => p.track === "paid-tech");
    }
    res.status(200).json({ programs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const listTrainers = async (req, res) => {
  try {
    const trainers = await UserModel.find({ role: "trainer" }).select(
      "firstName lastName email role"
    );
    res.status(200).json({ trainers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const listEnrollments = async (req, res) => {
  try {
    const internshipRecords = await UserInternship.find({})
      .populate("userId", "firstName lastName email phone")
      .sort({ createdAt: -1 });

    const userIds = internshipRecords.map((row) => row.userId?._id).filter(Boolean);
    const slugs = [...new Set(internshipRecords.map((row) => row.internshipSlug))];

    const [assignments, certificates] = await Promise.all([
      InternshipStudentAssignment.find({
        studentId: { $in: userIds },
        internshipSlug: { $in: slugs },
        active: true,
      }).populate("trainerId", "firstName lastName email"),
      InternshipCertificate.find({
        userId: { $in: userIds },
        internshipSlug: { $in: slugs },
      }),
    ]);

    const assignmentMap = new Map(
      assignments.map((row) => [`${row.studentId}-${row.internshipSlug}`, row])
    );
    const certificateMap = new Map(
      certificates.map((row) => [`${row.userId}-${row.internshipSlug}`, row])
    );

    res.status(200).json({
      enrollments: internshipRecords
        .filter((row) => row.userId)
        .map((row) => {
          const key = `${row.userId._id}-${row.internshipSlug}`;
          const assignment = assignmentMap.get(key);
          const certificate = certificateMap.get(key);
          const program = getInternshipBySlug(row.internshipSlug);

          return {
            id: assignment?._id || row._id,
            student: row.userId,
            trainer: assignment?.trainerId || null,
            internshipSlug: row.internshipSlug,
            programTitle: program?.title || row.title || row.internshipSlug,
            enrolledAt: row.createdAt,
            enrollmentSource: row.enrollmentSource || "payment",
            assignedAt: assignment?.createdAt || null,
            certificate: certificate
              ? {
                  issued: true,
                  uuid: certificate.uuid,
                  studentName: certificate.studentName,
                  issuedAt: certificate.createdAt,
                }
              : { issued: false },
          };
        }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const assignTrainer = async (req, res) => {
  try {
    const { trainerEmail, internshipSlug } = req.body;
    if (!trainerEmail || !internshipSlug) {
      return res.status(400).json({ message: "trainerEmail and internshipSlug are required" });
    }
    if (!getInternshipBySlug(internshipSlug)) {
      return res.status(400).json({ message: "Invalid internship program" });
    }

    const trainer = await findUserByEmail(trainerEmail);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer user not found" });
    }

    if (trainer.role !== "trainer" && trainer.role !== "admin") {
      trainer.role = "trainer";
      await trainer.save();
    }

    await getOrCreateProgramConfig(internshipSlug);

    const assignment = await InternshipTrainerAssignment.findOneAndUpdate(
      { trainerId: trainer._id, internshipSlug },
      {
        trainerId: trainer._id,
        internshipSlug,
        assignedBy: req.user._id,
        active: true,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Trainer assigned to internship program",
      assignment,
      trainer: {
        id: trainer._id,
        email: trainer.email,
        name: `${trainer.firstName} ${trainer.lastName || ""}`.trim(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const assignStudent = async (req, res) => {
  try {
    const { studentEmail, internshipSlug, trainerEmail } = req.body;
    if (!studentEmail || !internshipSlug) {
      return res.status(400).json({ message: "studentEmail and internshipSlug are required" });
    }

    const internship = getInternshipBySlug(internshipSlug);
    if (!internship) {
      return res.status(400).json({ message: "Invalid internship program" });
    }

    const student = await findUserByEmail(studentEmail);
    if (!student) {
      return res.status(404).json({ message: "Student user not found" });
    }

    let trainer = null;
    if (trainerEmail) {
      trainer = await findUserByEmail(trainerEmail);
      if (!trainer) {
        return res.status(404).json({ message: "Trainer user not found" });
      }
    }

    await enrollInternshipRecord({
      userId: student._id,
      slug: internshipSlug,
      paymentId: `admin-assign-${Date.now()}`,
      amount: "0",
      enrollmentSource: "admin_grant",
    });

    const studentAssignment = await InternshipStudentAssignment.findOneAndUpdate(
      { studentId: student._id, internshipSlug },
      {
        studentId: student._id,
        internshipSlug,
        trainerId: trainer?._id || null,
        assignedBy: req.user._id,
        active: true,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Student assigned to internship program",
      enrollment: studentAssignment,
      student: {
        email: student.email,
        name: `${student.firstName} ${student.lastName || ""}`.trim(),
      },
      trainer: trainer
        ? { email: trainer.email, name: `${trainer.firstName} ${trainer.lastName || ""}`.trim() }
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const promoteUserRole = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !["trainer", "admin", "student", "manager"].includes(role)) {
      return res.status(400).json({ message: "Valid email and role are required" });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User role updated to ${role}`,
      user: { email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const issueInternshipCertificate = async (req, res) => {
  try {
    const { studentEmail, internshipSlug, studentName } = req.body;
    if (!studentEmail || !internshipSlug || !studentName?.trim()) {
      return res.status(400).json({
        message: "studentEmail, internshipSlug, and studentName are required",
      });
    }

    const program = getInternshipBySlug(internshipSlug);
    if (!program) {
      return res.status(400).json({ message: "Invalid internship program" });
    }

    const student = await findUserByEmail(studentEmail);
    if (!student) {
      return res.status(404).json({ message: "Student user not found" });
    }

    const enrollment = await UserInternship.findOne({
      userId: student._id,
      internshipSlug,
    });
    if (!enrollment) {
      return res.status(400).json({ message: "Student is not enrolled in this program" });
    }

    const existing = await InternshipCertificate.findOne({
      userId: student._id,
      internshipSlug,
    });
    if (existing) {
      return res.status(200).json({
        message: "Certificate already issued",
        certificate: {
          uuid: existing.uuid,
          studentName: existing.studentName,
          programTitle: existing.programTitle,
          issuedAt: existing.createdAt,
        },
      });
    }

    const certificateTemplate = await resolveCertificateTemplateForProgram(internshipSlug);

    const certificate = await InternshipCertificate.create({
      userId: student._id,
      internshipSlug,
      programTitle: resolveProgramTitle(internshipSlug, {
        enrollmentTitle: enrollment.title,
        storedTitle: program?.title,
      }),
      studentName: studentName.trim(),
      uuid: await generateUniqueCertificateId("internship"),
      certificateTemplateId: certificateTemplate?._id || null,
      issuedBy: req.user._id,
    });

    res.status(200).json({
      message: "Internship certificate issued successfully",
      certificate: {
        uuid: certificate.uuid,
        studentName: certificate.studentName,
        programTitle: certificate.programTitle,
        issuedAt: certificate.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  listPrograms,
  listTrainers,
  listEnrollments,
  assignTrainer,
  assignStudent,
  promoteUserRole,
  issueInternshipCertificate,
  getOrCreateProgramConfig,
};
