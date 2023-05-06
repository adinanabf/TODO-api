const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255
  },
  password: {
    type: String,
    required: true,
    max: 2048,
    min: 8
  },
  date: {
    type: Date,
    default: Date.now
  },
  TODO: {
    type: Array
  }
});

module.exports = mongoose.model("User", userSchema);