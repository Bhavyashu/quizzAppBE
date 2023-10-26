const mongoose = require("mongoose");

const answersSchema = new mongoose.Schema({
  user: { 
    type:mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required : true
  },
  Question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Questions",
    required: true,
  },
  Exercise_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise", // Reference to the "Exercise" model
    required: true,
  },
  Language_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language", // Reference to the "Language" model
    required: true,
  },
});

// Create the "Questions" model
const Answers = mongoose.model("user_answers", answersSchema);

module.exports = { Answers };
