const mongoose = require("mongoose");

const internKycSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inviteId: { type: mongoose.Schema.Types.ObjectId, ref: "InternInvite", default: null },
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    collegeName: { type: String, required: true },
    programName: { type: String, required: true },
    photoUrl: { type: String, required: true },
    twelfthCertificateUrl: { type: String, required: true },
    aadharFrontUrl: { type: String, required: true },
    aadharBackUrl: { type: String, required: true },
    collegeIdUrl: { type: String, required: true },
    internshipSlug: { type: String, default: "" },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rejectedAt: { type: Date, default: null },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rejectionReason: { type: String, default: "" },
  },
  { timestamps: true }
);

internKycSchema.index(
  { userId: 1, internshipSlug: 1 },
  {
    unique: true,
    partialFilterExpression: { internshipSlug: { $type: "string", $ne: "" } },
  }
);
internKycSchema.index({ inviteId: 1 });

module.exports = mongoose.model("InternKyc", internKycSchema);
