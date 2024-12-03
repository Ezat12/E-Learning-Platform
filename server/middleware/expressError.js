const ApiError = require("../utils/apiError");

const expressError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "development") {
    nodeEnv(err, res);
  } else {
    nodePro(err, res);
  }
};

const nodeEnv = (err, res) => {
  if (err.name === "TokenExpiredError") {
    err = tokenExpiredError();
  }
  if (err.name === "JsonWebTokenError") {
    err = jsonWebTokenError();
  }
  res.status(404).json({
    statusCode: err.statusCode,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const nodePro = (err, res) => {
  if (err.name === "TokenExpiredError") {
    err = tokenExpiredError();
  }
  if (err.name === "JsonWebTokenError") {
    err = jsonWebTokenError();
  }
  res.status(404).json({
    statusCode: err.statusCode,
    message: err.message,
  });
};

const tokenExpiredError = () =>
  new ApiError("token expired ,please login again...", 401);

const jsonWebTokenError = () =>
  new ApiError("Invalid Token ,please login again...", 401);

module.exports = expressError;
