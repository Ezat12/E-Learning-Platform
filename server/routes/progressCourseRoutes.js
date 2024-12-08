const express = require("express");
const {
  getCurrentCourseProgress,
  restCurrentCourseProgress,
  resetWatchAgainCurrentCourseProgress,
} = require("../controllers/progressCourse-controller");
const { protectAuth } = require("../controllers/auth-controller");

const router = express.Router();

router
  .route("/getCurrentProgressCourse/:courseId")
  .get(protectAuth, getCurrentCourseProgress);

router
  .route("/restCurrentProgressCourse")
  .put(protectAuth, restCurrentCourseProgress);

router
  .route("/restWatchAgainCourseProgress")
  .put(protectAuth, resetWatchAgainCurrentCourseProgress);

module.exports = router;
