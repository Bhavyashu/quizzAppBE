const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Language', // Reference to the "Languages" model
  },
});

// Create the "Exercises" model
const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = { Exercise };
