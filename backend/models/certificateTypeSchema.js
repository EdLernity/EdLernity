const mongoose = require("mongoose");

const CERTIFICATE_TYPE_KINDS = ["certificate", "offer-letter"];

const certificateTypeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: { type: String, required: true, trim: true },
    kind: {
      type: String,
      enum: CERTIFICATE_TYPE_KINDS,
      default: "certificate",
    },
    description: { type: String, default: "" },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

certificateTypeSchema.index({ kind: 1, active: 1, sortOrder: 1 });

module.exports = {
  CertificateType: mongoose.model("CertificateType", certificateTypeSchema),
  CERTIFICATE_TYPE_KINDS,
};
