const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");
const validatorError = require("../../middleware/errorValidator");

const validatorCreateUser = [
  check("userName")
    .notEmpty()
    .withMessage("user name is required")
    .isLength({ min: 3 })
    .withMessage("user name must be more than 3 char")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userName: val });
      if (user) {
        throw new Error("user name already token");
      }
    }),
  check("userEmail")
    .notEmpty()
    .withMessage("user email is required")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userEmail: val });
      if (user) {
        throw new Error("email already token");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be more than 5 char"),
  validatorError,
];

const validatorUpdateUser = [
  check("userName")
    .optional()
    .isLength({ min: 3 })
    .withMessage("user name must be more than 3 char")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userName: val });
      if (user) {
        throw new Error("user name already token");
      }
    }),
  check("userEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userEmail: val });
      if (user) {
        throw new Error("email already token");
      }
    }),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("password must be more than 5 char"),
  validatorError,
];

const validatorGetUser = [
  check("id").isMongoId().withMessage("Invalid id"),
  validatorError,
];
const validatorDeleteUser = [
  check("id").isMongoId().withMessage("Invalid id"),
  validatorError,
];

module.exports = {
  validatorCreateUser,
  validatorUpdateUser,
  validatorGetUser,
  validatorDeleteUser,
};
