const { asyncErrorHandler } = require("express-error-catcher");
const Course = require("../models/courseModel");
const jsend = require("jsend");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
// const { query } = require("express");

const createCourse = asyncErrorHandler(async (req, res, next) => {
  req.body.user = req.user._id;
  console.log(req.body.user);

  const course = await Course.create(req.body);

  res.status(200).json(jsend.success(course));
});

const getAllCourseInstructor = (req, res, next) => {
  req.query = { user: req.user._id };
  next();
};

const getAllCourses = asyncErrorHandler(async (req, res, next) => {

  // let exQuery = { ...req.query };

  const allModel = new ApiFeatures(Course.find(), req.query)
    .filtering()
    .sort()
    .pagination();

  const { moduleMongoose } = allModel;

  const dataCourse = await moduleMongoose;

  res
    .status(201)
    .json(jsend.success({ result: dataCourse.length, courses: dataCourse }));
});

// const getAllCourses

const getDetailsCourse = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    return next(new ApiError(`not found course by id => ${id}`, 400));
  }

  res.status(201).json(jsend.success(course));
});

const updateCourse = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new ApiError(`not found course by id => ${id}`, 400));
  }

  if (req.user._id.toString() !== course.user._id.toString()) {
    return next(new ApiError("you are not allowed to update this course", 404));
  }

  const updateCourse = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.status(200).json(jsend.success(updateCourse));
});

const deleteCourse = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findByIdAndDelete(id);

  if (!course) {
    return next(new ApiError(`not found course by id => ${id}`, 400));
  }

  res.status(201).json(jsend.success("success deleted"));
});

module.exports = {
  createCourse,
  getAllCourses,
  getDetailsCourse,
  updateCourse,
  deleteCourse,
  getAllCourseInstructor,
};
