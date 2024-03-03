const mongoose = require("mongoose");

const userCourseSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
};

const courseModel = mongoose.model("UserCourses", userCourseSchema);

module.exports = courseModel;
