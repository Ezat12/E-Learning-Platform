const { asyncErrorHandler } = require("express-error-catcher");
const jwt = require("jsonwebtoken");
const jsend = require("jsend");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");

const getToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.EXPIRED_TOKEN,
  });
};

const signUp = asyncErrorHandler(async (req, res, next) => {
  const { userName, userEmail, password } = req.body;

  const newUser = await User.create({ userName, userEmail, password });

  const token = getToken(newUser._id);

  res.status(200).json(jsend.success({ user: newUser, token }));
});

const login = asyncErrorHandler(async (req, res, next) => {
  const { userEmail, password } = req.body;

  const user = await User.findOne({ userEmail });

  if (!user) {
    return next(new ApiError("incorrect email or password", 400));
  }

  const checkCorrectPassword = await bcrypt.compare(password, user.password);

  if (!user || !checkCorrectPassword) {
    return next(new ApiError("incorrect email or password", 400));
  }

  const token = getToken(user._id);

  res.status(200).json(jsend.success({ user, token }));
});

const protectAuth = asyncErrorHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError("you are not login ,please login ....", 401));
  }

  const decoded = jwt.verify(token, process.env.SECRET_TOKEN);

  const currentUser = await User.findById(decoded.id);
  req.user = currentUser;
  next();
});

const allowedTo = (...allowed) =>
  asyncErrorHandler(async (req, res, next) => {
    if (!allowed.includes(req.user.role)) {
      return next(new ApiError("you are not access this route", 404));
    }
    next();
  });

module.exports = {
  signUp,
  login,
  protectAuth,
  allowedTo,
};
