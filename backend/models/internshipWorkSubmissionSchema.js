const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    selectedIndex: { type: Number, default: null },
    textAnswer: { type: String, default: "" },
  },
  { _id: false }
);

const internshipWorkSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    internshipSlug: { type: String, required: true, index: true },
    kind: {
      type: String,
      enum: ["assignment", "project"],
      required: true,
    },
    weekIndex: { type: Number, required: true },
    classId: { type: String, default: null },
    answers: [answerSchema],
    githubUrl: { type: String, default: "" },
    mcqScore: { type: Number, default: 0 },
    mcqTotal: { type: Number, default: 0 },
    /** Snapshot of pass/fail for assignments at submit (also recomputed in progress). */
    passed: { type: Boolean, default: null },
    passingScore: { type: Number, default: null },
    /**
     * Project review lifecycle.
     * pending = awaiting trainer review (or after resubmit)
     * approved = trainer verified
     * rejected = must resubmit with improvements
     */
    reviewStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewReason: { type: String, default: "" },
    reviewedAt: { type: Date, default: null },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

internshipWorkSubmissionSchema.index(
  { userId: 1, internshipSlug: 1, kind: 1, weekIndex: 1, classId: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "InternshipWorkSubmission",
  internshipWorkSubmissionSchema
);
