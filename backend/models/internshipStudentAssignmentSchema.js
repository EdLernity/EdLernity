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
    /** Set when trainer marks internship completed for this student. */
    internshipCompleted: { type: Boolean, default: false },
    internshipCompletedAt: { type: Date, default: null },
    internshipCompletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    /** True when trainer forced completion before all work passed/approved. */
    internshipCompletedOverride: { type: Boolean, default: false },
  },
  { timestamps: true }
);

internshipStudentAssignmentSchema.index({ studentId: 1, internshipSlug: 1 }, { unique: true });

module.exports = mongoose.model(
  "InternshipStudentAssignment",
  internshipStudentAssignmentSchema
);
