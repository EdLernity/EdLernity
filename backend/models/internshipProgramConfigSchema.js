const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    url: { type: String, default: "" },
    type: { type: String, default: "pdf" },
    available: { type: Boolean, default: true },
  },
  { _id: false }
);

const assignmentQuestionSchema = new mongoose.Schema(
  {
    id: String,
    type: { type: String, enum: ["mcq", "text"], default: "mcq" },
    prompt: { type: String, default: "" },
    options: [{ type: String }],
    correctOptionIndex: { type: Number, default: 0 },
  },
  { _id: false }
);

const classAssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    dueLabel: { type: String, default: "" },
    instructions: { type: String, default: "" },
    /** Minimum MCQ correct answers required to pass (default 8). */
    passingScore: { type: Number, default: 8 },
    questions: [assignmentQuestionSchema],
  },
  { _id: false }
);

const liveClassFields = {
  id: String,
  title: String,
  meetingLink: { type: String, default: "" },
  recordingUrl: { type: String, default: "" },
  noteTitle: { type: String, default: "" },
  noteUrl: { type: String, default: "" },
  scheduleDay: String,
  scheduleTime: String,
  assignment: { type: classAssignmentSchema, default: () => ({}) },
};

const moduleSchema = new mongoose.Schema(
  {
    weekIndex: { type: Number, required: true },
    week: String,
    topic: String,
    isCapstone: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    liveClass: liveClassFields,
    liveClasses: [liveClassFields],
    recording: {
      title: String,
      url: { type: String, default: "" },
      duration: String,
    },
    recordings: [
      {
        id: String,
        title: String,
        url: { type: String, default: "" },
        duration: String,
      },
    ],
    notes: [resourceSchema],
    assignment: {
      title: String,
      dueLabel: String,
      instructions: { type: String, default: "" },
      type: { type: String, default: "assignment" },
      githubRequired: { type: Boolean, default: false },
      /** Brief / requirements document URL (Drive, PDF, Notion, etc.) */
      documentUrl: { type: String, default: "" },
      documentTitle: { type: String, default: "" },
      /** How many calendar weeks this project covers (1–3). */
      spanWeeks: { type: Number, default: 1 },
      /**
       * If set, this week is part of a multi-week project anchored on another week.
       * Submission is only expected on the anchor week.
       */
      projectAnchorWeekIndex: { type: Number, default: null },
    },
    resources: [resourceSchema],
  },
  { _id: false }
);

const internshipProgramConfigSchema = new mongoose.Schema(
  {
    internshipSlug: { type: String, required: true, unique: true },
    title: String,
    category: String,
    coverImage: String,
    syllabusNote: String,
    liveSchedule: [
      {
        day: String,
        time: String,
      },
    ],
    bonuses: [
      {
        id: String,
        title: String,
        description: String,
        status: { type: String, default: "included" },
        meetingLink: { type: String, default: "" },
        url: { type: String, default: "" },
        active: { type: Boolean, default: false },
        loginInstructions: { type: String, default: "" },
      },
    ],
    certificate: {
      title: String,
      requirement: String,
      notes: String,
    },
    support: {
      email: String,
      whatsapp: String,
      officeHours: String,
      meetingLink: { type: String, default: "" },
    },
    announcements: [
      {
        id: String,
        title: String,
        body: String,
        date: String,
        type: { type: String, default: "info" },
      },
    ],
    modules: [moduleSchema],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternshipProgramConfig", internshipProgramConfigSchema);
