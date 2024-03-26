const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  lessonList: {
    type: [
      {
        title: String,
        url: String,
        duration: String,
      }
    ]
  },
  resources: { type: Array, default: [] },
  courseId: { type: String, required: true, ref: "Course" },
});

module.exports = mongoose.model("Player", PlayerSchema);
