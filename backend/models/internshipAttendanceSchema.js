const mongoose = require("mongoose");

const internshipAttendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    internshipSlug: { type: String, required: true, index: true },
    weekIndex: { type: Number, required: true },
    classId: { type: String, required: true },
    /** First time the student clicked Join Live Class. */
    joinedAt: { type: Date, default: Date.now },
    /** Most recent Join click. */
    lastJoinedAt: { type: Date, default: Date.now },
    joinCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

internshipAttendanceSchema.index(
  { userId: 1, internshipSlug: 1, weekIndex: 1, classId: 1 },
  { unique: true }
);

module.exports = mongoose.model("InternshipAttendance", internshipAttendanceSchema);
