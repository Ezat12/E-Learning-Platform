const { check } = require("express-validator");
const validationError = require("../../middleware/errorValidator");

const validatorCreateCourse = [
  check("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 4 })
    .withMessage("title must be greater than 4 char"),
  check("category").notEmpty().withMessage("category is required"),
  check("level").notEmpty().withMessage("level is required"),
  check("subTitle").notEmpty().withMessage("subTitle is required"),
  check("price").notEmpty().withMessage("price is required"),
  check("welcomeMessage").notEmpty().withMessage("welcomeMessage is required"),
  check("curriculum.*.title")
    .notEmpty()
    .withMessage("title curriculum is required")
    .isLength({ min: 4 })
    .withMessage("title curriculum must be greater than 4 char"),
  check("curriculum.*.freePreview")
    .notEmpty()
    .withMessage("freePreview curriculum is required"),
  check("curriculum.*.videoUrl").notEmpty().withMessage("video is required"),
  validationError,
];

const validatorUpdateCourse = [
  check("title")
    .optional()
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 4 })
    .withMessage("title must be greater than 4 char"),
  check("curriculum.*.title")
    .notEmpty()
    .withMessage("title curriculum is required")
    .isLength({ min: 4 })
    .withMessage("title curriculum must be greater than 4 char"),
  validationError,
];

const validatorGetDetailsCourse = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validationError,
];
const validatorDeleteCourse = [
  check("id").isMongoId().withMessage("Invalid Id"),
  validationError,
];

module.exports = {
  validatorCreateCourse,
  validatorUpdateCourse,
  validatorGetDetailsCourse,
  validatorDeleteCourse,
};
