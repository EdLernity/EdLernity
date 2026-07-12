const mongoose = require("mongoose");

const careersProgramSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    trackLabel: { type: String, default: "" },
    description: { type: String, default: "" },
    highlights: [{ type: String }],
    coverImage: { type: String, default: "" },
    applyUrl: { type: String, default: "" },
    location: { type: String, default: "Remote" },
    duration: { type: String, default: "2 Months" },
    preferred: { type: Boolean, default: false },
    preferredNote: { type: String, default: "" },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    certificateTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateTemplate",
      default: null,
    },
    offerLetterTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateTemplate",
      default: null,
    },
    offerLetterRoleDescription: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareersProgram", careersProgramSchema);
