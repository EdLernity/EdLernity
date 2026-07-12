const mongoose = require("mongoose");

const internshipTrainerAssignmentSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    internshipSlug: { type: String, required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

internshipTrainerAssignmentSchema.index({ trainerId: 1, internshipSlug: 1 }, { unique: true });

module.exports = mongoose.model(
  "InternshipTrainerAssignment",
  internshipTrainerAssignmentSchema
);
