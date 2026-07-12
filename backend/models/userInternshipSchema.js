const mongoose = require("mongoose");

const userInternshipSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
    paymentId: {
      type: String,
      default: null,
    },
    amount: {
      type: String,
      default: null,
    },
    enrollmentSource: {
      type: String,
      enum: ["payment", "admin_grant", "invite"],
      default: "payment",
    },
  },
  { timestamps: true }
);

userInternshipSchema.index({ userId: 1, internshipSlug: 1 }, { unique: true });

const UserInternship = mongoose.model("UserInternship", userInternshipSchema);

module.exports = UserInternship;
