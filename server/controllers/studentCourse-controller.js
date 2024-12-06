const { asyncErrorHandler } = require("express-error-catcher");
const StudentCourse = require("../models/studentCoursesModel");
const jsend = require("jsend");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

const getAllCourseStudent = asyncErrorHandler(async (req, res, next) => {
  const studentCourses = await StudentCourse.findOne({
    user: req.user._id,
  });

  console.log(studentCourses);

  res.status(200).json(jsend.success(studentCourses));
});

const deleteCourseStudent = asyncErrorHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const studentCourses = await StudentCourse.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { courses: { course: courseId } } },
    { new: true }
  );

  res.status(201).json(jsend.success(studentCourses.courses));
});

module.exports = { getAllCourseStudent, deleteCourseStudent };
