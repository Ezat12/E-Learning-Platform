const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    require: ["user name is required"],
    unique: [true, "user name must be unique"],
    minLength: [3, "user name must be more than 3 char"],
    trim: true,
  },
  userEmail: {
    type: String,
    require: ["user email is required"],
    unique: [true, "user email must be unique"],
  },
  password: {
    type: String,
    minLength: [6, "password must be more than 5 char"],
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


module.exports = mongoose.model("users", userSchema);
