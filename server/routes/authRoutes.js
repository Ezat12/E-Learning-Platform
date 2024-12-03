const express = require("express");
const { signUp, login } = require("../controllers/auth-controller");
const { validatorCreateUser } = require("../utils/validator/validatorUser");

const router = express.Router();

router.route("/signup").post(validatorCreateUser, signUp);

router.route("/login").post(login);

module.exports = router;
