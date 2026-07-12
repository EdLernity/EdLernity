const UserInternship = require("../models/userInternshipSchema");
const InternshipCertificate = require("../models/internshipCertificateSchema");
const { getInternshipBySlug } = require("../utils/internshipCatalog");
const { getOrCreateProgramConfig } = require("./internshipAdminController");
const { STATIC_CERTIFICATE, resolveBonuses } = require("../utils/internshipConfigDefaults");

const DEFAULT_HIGHLIGHTS = [
  "12-week structured internship curriculum",
  "Live mentor sessions twice a week",
  "Hands-on assignments and capstone project",
  "Recordings, notes, and bonus workshops",
  "ISO 9001:2015 internship certificate",
];

/** Simple pass-through: students see what the trainer configured. */
function mapModule(module, weekIndex) {
  const meetingLink = module.liveClass?.meetingLink || null;
  const recordingUrl = module.recording?.url || null;

  return {
    id: `week-${weekIndex + 1}`,
    week: module.week,
    topic: module.topic,
    isCapstone: module.isCapstone,
    published: module.published !== false,
    liveClass: {
      title: module.liveClass?.title || `${module.week} Live Session`,
      schedule: {
        day: module.liveClass?.scheduleDay || "",
        time: module.liveClass?.scheduleTime || "",
      },
      meetingLink,
    },
    recording: {
      title: module.recording?.title || `${module.week} Recording`,
      duration: module.recording?.duration || "1h 45m",
      url: recordingUrl,
      available: Boolean(recordingUrl),
    },
    notes: (module.notes || []).map((note) => ({
      title: note.title,
      type: note.type || "pdf",
      url: note.url || null,
      available: Boolean(note.url),
    })),
    assignment: {
      title: module.assignment?.title || "",
      dueLabel: module.assignment?.dueLabel || "",
      instructions: module.assignment?.instructions || "",
      type: module.assignment?.type || "assignment",
    },
    resources: (module.resources || []).map((r) => ({
      title: r.title,
      type: r.type || "reference",
      url: r.url || null,
      available: Boolean(r.url),
    })),
  };
}

const getStudentDashboard = async (req, res) => {
  try {
    const { slug } = req.params;
    const enrollment = await UserInternship.findOne({
      userId: req.user._id,
      internshipSlug: slug,
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this program" });
    }

    const config = await getOrCreateProgramConfig(slug);
    if (!config) {
      return res.status(404).json({ message: "Program not found" });
    }

    const catalogEntry = getInternshipBySlug(slug);
    const modules = (config.modules || []).map((m, index) =>
      mapModule(m, m.weekIndex ?? index)
    );

    const issuedCertificate = await InternshipCertificate.findOne({
      userId: req.user._id,
      internshipSlug: slug,
    });

    const totalWeeks = modules.length;
    const weeksWithLinks = modules.filter((m) => m.liveClass.meetingLink || m.recording.url).length;
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
        uuid: issuedCertificate?.uuid || null,
        studentName: issuedCertificate?.studentName || null,
        issuedAt: issuedCertificate?.createdAt || null,
      },
      announcements: config.announcements || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { getStudentDashboard };
