const mongoose = require('mongoose');

// Define the schema for the "Languages" collection
const languageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  exercises : {
    type: Number, 
    default: 0
  },
  total_questions : {
    type: Number, 
    default: 0
  },
  total_score : {
    type: Number, 
    default: 0
  }
});

const Language = mongoose.model('Languages', languageSchema);

module.exports = {Language};