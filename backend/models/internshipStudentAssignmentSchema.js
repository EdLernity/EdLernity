const mongoose = require("mongoose");

const internshipStudentAssignmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    internshipSlug: { type: String, required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

internshipStudentAssignmentSchema.index({ studentId: 1, internshipSlug: 1 }, { unique: true });

module.exports = mongoose.model(
  "InternshipStudentAssignment",
  internshipStudentAssignmentSchema
);
