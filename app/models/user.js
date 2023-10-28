const mongoose = require('mongoose');
const {Language} = require('./language'); // Adjust the path to the "language" file as needed

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    over_all_score: { type: Number, default: 0 },
    preffered_languge: [
      {
        language: { type: mongoose.Schema.Types.ObjectId, ref: Language },
        score: { type: Number, default: 0 },
        proficiency: { type: String, default: 'Beginner' }
      }
    ]
  });

const User = mongoose.model('User', userSchema);

module.exports = { User };
