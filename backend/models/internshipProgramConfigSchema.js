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

const moduleSchema = new mongoose.Schema(
  {
    weekIndex: { type: Number, required: true },
    week: String,
    topic: String,
    isCapstone: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    liveClass: {
      title: String,
      meetingLink: { type: String, default: "" },
      scheduleDay: String,
      scheduleTime: String,
    },
    recording: {
      title: String,
      url: { type: String, default: "" },
      duration: String,
    },
    notes: [resourceSchema],
    assignment: {
      title: String,
      dueLabel: String,
      instructions: { type: String, default: "" },
      type: { type: String, default: "assignment" },
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
