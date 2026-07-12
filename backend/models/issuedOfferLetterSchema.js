const mongoose = require("mongoose");

const issuedOfferLetterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internshipSlug: { type: String, required: true },
    candidateName: { type: String, required: true },
    templateId: { type: String, default: "marketing" },
    templateLabel: { type: String, default: "" },
    offerLetterTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CertificateTemplate",
      default: null,
    },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    emailSent: { type: Boolean, default: true },
  },
  { timestamps: true }
);

issuedOfferLetterSchema.index({ userId: 1, internshipSlug: 1 });

module.exports = mongoose.model("IssuedOfferLetter", issuedOfferLetterSchema);
