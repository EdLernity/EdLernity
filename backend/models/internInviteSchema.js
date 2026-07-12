const mongoose = require("mongoose");

const internInviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    internshipSlug: { type: String, required: true, default: "sales-marketing" },
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "cancelled"],
      default: "pending",
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date, default: null },
    inviteMessage: { type: String, default: "" },
    onboardingPassword: { type: String, default: null },
  },
  { timestamps: true }
);

internInviteSchema.index({ email: 1, internshipSlug: 1, status: 1 });

module.exports = mongoose.model("InternInvite", internInviteSchema);
