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
        dateOfPurchase: Date,
      },
    ],
  },
  { timestamps: true }
);

schemaStudentCourses.pre(/^find/, function (next) {
  this.populate({ path: "courses.course" });
  next();
});

module.exports = mongoose.model("StudentCourse", schemaStudentCourses);
