const express = require("express");
const app = express();
const router = express.Router();
const {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user-controller");
const {
  validatorCreateUser,
  validatorGetUser,
  validatorUpdateUser,
  validatorDeleteUser,
} = require("../utils/validator/validatorUser");
const { protectAuth, allowedTo } = require("../controllers/auth-controller");

router.use(protectAuth, allowedTo("admin"));

router.route("/").post(validatorCreateUser, createUser).get(getAllUser);

router
  .route("/:id")
  .get(validatorGetUser, getUser)
  .put(validatorUpdateUser, updateUser)
  .delete(validatorDeleteUser, deleteUser);

module.exports = router;
