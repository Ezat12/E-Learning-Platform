const mongoose = require("mongoose");

const schemaProgressCourse = new mongoose.Schema({
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
  completed: {
    type: Boolean,
    default: false,
  },
  lecturesProgress: [
    {
      title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [4, "title must be greater than 4 char"],
      },
      videoUrl: {
        type: String,
        required: [true, "video is required"],
      },
      completedLecture: {
        type: Boolean,
        default : false, 
      }
    },
  ],
});


module.exports = mongoose.model("ProgressCourse" , schemaProgressCourse)
