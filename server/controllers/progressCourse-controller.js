const { asyncErrorHandler } = require("express-error-catcher");
const Course = require("../models/courseModel");
const StudentCourse = require("../models/studentCoursesModel");
const ProgressCourse = require("../models/progressCourseModel");
const jsend = require("jsend");
const ApiError = require("../utils/apiError");

const getCurrentCourseProgress = asyncErrorHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const studentCourse = await StudentCourse.findOne({ user: req.user._id });

  console.log("Student Course", studentCourse);

  const checkPurchase = studentCourse?.courses?.some(
    (course) => course?.course?._id.toString() === courseId
  );

  console.log("checkPurchase", checkPurchase);

  if (!checkPurchase) {
    return next(new ApiError("you are not purchase course", 404));
  }

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ApiError(`not fond course by id => ${courseId}`));
  }

  const checkProgressCourseToUser = await ProgressCourse.findOne({
    user: req.user._id,
    course: courseId,
  });

  if (!checkProgressCourseToUser) {
    const createProgressCourseToUser = await ProgressCourse.create({
      user: req.user._id,
      course: courseId,
      lecturesProgress: course.curriculum,
    });

    return res.status(200).json(jsend.success(createProgressCourseToUser));
  }

  console.log("check", checkProgressCourseToUser);

  res.status(200).json(jsend.success(checkProgressCourseToUser));
});

const restCurrentCourseProgress = asyncErrorHandler(async (req, res, next) => {
  const { index } = req.body;

  const progressCourseUser = await ProgressCourse.findOne({
    user: req.user._id,
  });

  progressCourseUser.lecturesProgress[index].completedLecture = true;

  await progressCourseUser.save();

  const progressCourseUserAfterUpdate = await ProgressCourse.findOne({
    user: req.user._id,
  });

  res.status(201).json(jsend.success(progressCourseUserAfterUpdate));
});

const resetWatchAgainCurrentCourseProgress = asyncErrorHandler(
  async (req, res, next) => {
    const progressUser = await ProgressCourse.findOneAndUpdate(
      { user: req.user._id },
      { $set: { "lecturesProgress.$[].completedLecture": false } },
      { new: true }
    );
    res.status(201).json(jsend.success(progressUser));
  }
);

module.exports = {
  getCurrentCourseProgress,
  restCurrentCourseProgress,
  resetWatchAgainCurrentCourseProgress,
};
