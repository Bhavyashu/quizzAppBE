const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  Question: {
    type: String,
    required: true,
  },
  Answer: {
    type: String,
    required: true,
  },
  Difficulty_level: {
    type: Number,
    required: true,
  },
  Exercise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise', // Reference to the "Exercise" model
    required: true,
  },
  Language_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language', // Reference to the "Language" model
    required: true,
  },
});

// Create the "Questions" model
const Questions = mongoose.model('Questions', questionSchema);

module.exports = { Questions };
