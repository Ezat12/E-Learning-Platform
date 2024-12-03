const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minlength: [4, "title must be greater than 4 char"],
  },
  freePreview: {
    type: Boolean,
    required: [true, "free preview required"],
  },
  public_id: String,
  videoUrl: {
    type: String,
    required: [true, "video is required"],
  },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [4, "title must be greater than 4 char"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    level: {
      type: String,
      required: [true, "Level is required"],
    },
    language: {
      type: String,
    },
    subTitle: {
      type: String,
      required: [true, "SubTitle is required"],
    },
    price: {
      type: Number,
      required: [true, "Price must be required"],
    },
    objective: {
      type: String,
    },
    welcomeMessage: {
      type: String,
      required: [true, "Welcome Message required"],
    },
    courseImage: {
      type: String,
      required: [true, "image course required"],
    },
    student: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "users",
      },
    ],
    curriculum: [lectureSchema],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

courseSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "userName" });
  next();
});

module.exports = mongoose.model("Course", courseSchema);
