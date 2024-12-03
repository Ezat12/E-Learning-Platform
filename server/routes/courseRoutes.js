const express = require("express");
const {
  createCourse,
  getAllCourses,
  getDetailsCourse,
  updateCourse,
  deleteCourse,
  getAllCourseInstructor,
} = require("../controllers/course-controller");
const {
  validatorCreateCourse,
  validatorGetDetailsCourse,
  validatorUpdateCourse,
  validatorDeleteCourse,
} = require("../utils/validator/validatorCourse");

const { protectAuth, allowedTo } = require("../controllers/auth-controller");

const router = express.Router();

router.use(
  "/course-instructor",
  protectAuth,
  allowedTo("instructor"),
  getAllCourseInstructor,
  getAllCourses
);

router
  .route("/")
  .post(
    protectAuth,
    allowedTo("instructor"),
    validatorCreateCourse,
    createCourse
  )
  .get(getAllCourses);

router
  .route("/:id")
  .get(validatorGetDetailsCourse, getDetailsCourse)
  .put(
    protectAuth,
    allowedTo("instructor"),
    validatorUpdateCourse,
    updateCourse
  )
  .delete(
    protectAuth,
    allowedTo("instructor", "admin"),
    validatorDeleteCourse,
    deleteCourse
  );

module.exports = router;
