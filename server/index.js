const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const compression = require("compression");
dotenv.config();
const cors = require("cors");
const path = require("path");
const connectedDB = require("./config/connected_db");
const expressError = require("./middleware/expressError");
const userRoute = require("./routes/userRoutes");
const userAuth = require("./routes/authRoutes");
const uploadRoute = require("./routes/uploadCloudinaryRoutes");
const courseRoute = require("./routes/courseRoutes");
const orderRoute = require("./routes/orderRoutes");
const studentCourseRoute = require("./routes/studentCourseRoutes");
const progressStudentRoute = require("./routes/progressCourseRoutes");
const ApiError = require("./utils/apiError");
const { webhookCheckout } = require("./controllers/order-controller");

// Connected DB
connectedDB();

app.use(cors());
app.options("*", cors());
app.use(compression());
// app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname));

app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

app.use(express.json());

// Routes
app.use("/api/v1/user", userRoute);

app.use("/api/v1", userAuth);

app.use("/api/v1", studentCourseRoute);

app.use("/api/v1", progressStudentRoute);

app.use("/api/v1/course", courseRoute);

app.use("/api/v1/upload", uploadRoute);

app.use("/api/v1/order", orderRoute);

// handle error routes
app.all("*", (req, res, next) => {
  next(new ApiError(`the route is not success ${req.originalUrl}`, 404));
});

// handle error express
app.use(expressError);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server is ready on port ${port}`);
});
