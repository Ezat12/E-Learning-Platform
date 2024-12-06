const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const compression = require("compression");
dotenv.config();
const cors = require("cors");
const connectedDB = require("./config/connected_db");
const expressError = require("./middleware/expressError");
const userRoute = require("./routes/userRoutes");
const userAuth = require("./routes/authRoutes");
const uploadRoute = require("./routes/uploadCloudinaryRoutes");
const courseRoute = require("./routes/courseRoutes");
const orderRoute = require("./routes/orderRoutes");
const ApiError = require("./utils/apiError");
const { webhookCheckout } = require("./controllers/order-controller");

// Connected DB
connectedDB();

app.use(cors());
app.use(compression());
app.options("*", cors());
app.use(express.json());


app.post("/webhook-checkout", express.raw({ type: "application/json" }) , webhookCheckout);

// Routes
app.use("/api/v1/user", userRoute);

app.use("/api/v1", userAuth);

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
