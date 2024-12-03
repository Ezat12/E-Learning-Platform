const User = require("../models/userModel");
const { asyncErrorHandler } = require("express-error-catcher");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/apiError");

const createUser = asyncErrorHandler(async (req, res, next) => {
  const { userName, userEmail, password } = req.body;

  const user = await User.findOne({ $or: [{ userName, userEmail }] });
  if (user) {
    return next(new ApiError(`user name is already token`, 404));
  }

  const createTheUser = await User.create({ userName, userEmail, password });

  res.status(200).json({ data: createTheUser });
});

const getAllUser = asyncErrorHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(201).json({ data: users });
});

const getUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(`not found user by id => ${id}`, 400));
  }
  res.status(201).json({ user });
});

const updateUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!user) {
    return next(new ApiError(`not found user by id => ${id}`, 404));
  }
  res.status(201).json({ user });
});

const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(`not found user by id => ${id}`, 404));
  }
  res.status(201).json({ msg: "Success Deleted" });
});

module.exports = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
};
