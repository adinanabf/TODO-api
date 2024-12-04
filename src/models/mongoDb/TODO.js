const mongoose = require("mongoose");

const TODO = new mongoose.Schema({
  userId: {
    type: String,
    min: 0,
    max: 255,
  },
  description: {
    type: String,
    required: true,
    min: 1,
    max: 255,
  },
  deadline: {
    type: Date,
    required: true,
  },
  lastmodification: {
    type: Date,
    default: Date.now,
  },
  statusconclusion: {
    type: Boolean,
  },
});

module.exports = mongoose.model("TODO", TODO);
