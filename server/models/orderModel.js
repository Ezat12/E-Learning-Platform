const mongoose = require("mongoose");

const schemaOrder = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: [true, "course is required"],
    },
    coursePrice: {
      type: Number,
      required: [true, "price is required"],
    },
    orderData: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", schemaOrder);
