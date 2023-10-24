const mongoose = require('mongoose');

// Define the schema for the "Languages" collection
const languageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },});

const Language = mongoose.model('Languages', languageSchema);

module.exports = {Language};