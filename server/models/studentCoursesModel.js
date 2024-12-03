const mongoose = require("mongoose");

const schemaStudentCourses = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    courses: [
      {
        course: {
          type: mongoose.Schema.ObjectId,
          ref: "Course",
        },
        dataOfPurchase: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentCourse", schemaStudentCourses);
