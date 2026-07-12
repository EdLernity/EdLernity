const mongoose = require("mongoose");

const internshipCertificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    internshipSlug: {
      type: String,
      required: true,
    },
    programTitle: {
      type: String,
      default: "",
    },
    studentName: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

internshipCertificateSchema.index({ userId: 1, internshipSlug: 1 }, { unique: true });

module.exports = mongoose.model("InternshipCertificate", internshipCertificateSchema);
