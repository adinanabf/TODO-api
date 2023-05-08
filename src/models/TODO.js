const mongoose = require('mongoose');

const TODO_Schema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    min: 1,
    max: 255
  },
  deadline: {
    type: Date,
    required: true
  },
  lastModification:{
    type: Date,
    default: Date.now
  },
  statusConclusion:{
    type: Boolean
  },
  datetimeConclusion:{
    type: Date
  }
});

module.exports = mongoose.model('TODOSchema', TODO_Schema);