const express = require("express");
const { protectAuth, allowedTo } = require("../controllers/auth-controller");
const {
  getAllCourseStudent,
  deleteCourseStudent,
} = require("../controllers/studentCourse-controller");
const router = express.Router();

router
  .route("/getCoursesStudent")
  .get(protectAuth, allowedTo("user"), getAllCourseStudent);
router
  .route("/deleteCourseStudent/:courseId")
  .delete(protectAuth, allowedTo("user"), deleteCourseStudent);

module.exports = router;
