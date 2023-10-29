const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema to track user performance
const userProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to the User schema

  languageProgress: [ // array of the langugages ID where a user has given quiz for 
    {
      language: { type: Schema.Types.ObjectId, ref: 'Language' }, // Reference to the Language schema
      exercises: [  // array of the excrcise ids where the user has attented question for 
        {
          exercise: { type: Schema.Types.ObjectId, ref: 'Exercise' }, // Reference to the Exercise schema
          completedQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }], // References to the completed questions
        }
      ],
    }
  ]
});

const Progress = mongoose.model('user_progress', userProgressSchema);

module.exports = {Progress};
