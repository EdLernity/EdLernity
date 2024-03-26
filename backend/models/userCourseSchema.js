const mongoose = require("mongoose");

const userCourseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transaction",
  },
  paid: {
    type: Boolean,
  },
  courseIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  isAllCourse: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true }); 

const courseModel = mongoose.model("UserCourses", userCourseSchema);

module.exports = courseModel;
