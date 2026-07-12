const mongoose = require("mongoose");

const certificateTemplateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    label: { type: String, required: true, trim: true },
    pdfUrl: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

certificateTemplateSchema.index({ type: 1, active: 1 });

module.exports = {
  CertificateTemplate: mongoose.model("CertificateTemplate", certificateTemplateSchema),
};
