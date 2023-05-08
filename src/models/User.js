const mongoose = require('mongoose');
const TODOSchema = require('./TODO').schema

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
    max: 255,
    min: 8
  },
  userCreation: {
    type: Date,
    default: Date.now
  },
  TODO: {
    type: [TODOSchema]
  }
});

module.exports = mongoose.model('User', userSchema);