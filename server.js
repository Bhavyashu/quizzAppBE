require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const { connectDb } = require('./app/config/db');
const { errorHandler } = require('./app/error');
const routes = require('./app/routes');
const { logger } = require('./app/config/logger');
// const { Language, Exercise, Questions, Answers} = require('./app/models');
// const _execute = require('./databaseScripts');
global.logger = logger;

const app = express();

connectDb();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/test', (req, res) => {
  res.status(200).json({ message: 'api working' });
});

app.use('/api/v1', routes);

app.use(errorHandler);

// require('./app/error/handleUncaughtErrors');


app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Add 'Authorization'
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Add any other HTTP methods you need

  next();
});


// app.post('/addl', async (req, res) => {
//   try {
//     // Get the language string from req.body
//     const name = req.body.language;
//     console.log(name);

//     // Add your asynchronous logic here, e.g., working with promises
//     let lang =  new Language({
//       name,
//     })
//     lang = await lang.save();
//     console.log("lonageu created? ", lang);
    
//     if (lang) {
//       // Send a success response
//       res.status(200).json({ success: true, message: 'Language added successfully', data : lang });
//     } else {
//       // Send a failure response
//       res.status(400).json({ success: false, message: 'Failed to add language' });
//     }
//   } catch (error) {
//     // Handle any errors that may occur during processing
//     console.error('An error occurred:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// });
// const userId = '6537ddb85a080d9f8b754c7b';
// const questArray  = [
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d019f"),
//     Question: 'What is a pronoun?',
//     Answer: 'A pronoun is a word used to replace a noun to avoid repetition.',
//     Difficulty_level: 1,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a0"),
//     Question: 'Identify the pronoun in the sentence: "She is reading a book."',
//     Answer: 'Pronoun: She',
//     Difficulty_level: 4,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a1"),
//     Question: 'Rewrite the sentence using a pronoun: "The dog is barking loudly."',
//     Answer: 'It is barking loudly.',
//     Difficulty_level: 5,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a4"),
//     Question: 'Write a sentence using an indefinite pronoun.',
//     Answer: 'Everyone enjoyed the party.',
//     Difficulty_level: 3,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a5"),
//     Question: 'Replace the noun with a pronoun: "The car is fast."',
//     Answer: 'It is fast.',
//     Difficulty_level: 2,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a6"),
//     Question: 'Identify the relative pronoun in the sentence: "The book that I read is interesting."',
//     Answer: 'Relative Pronoun: that',
//     Difficulty_level: 4,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a7"),
//     Question: 'Write a sentence using both a subject and an object pronoun.',
//     Answer: 'She loves him.',
//     Difficulty_level: 3,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a8"),
//     Question: 'What is the plural form of "it"?',
//     Answer: 'they',
//     Difficulty_level: 5,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a3"),
//     Question: 'Provide an example of a reflexive pronoun.',
//     Answer: 'Example: herself',
//     Difficulty_level: 2,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   },
//   {
//     _id: new mongoose.Types.ObjectId("65381390bfd680a7135d01a2"),
//     Question: 'What is the possessive pronoun for "he"?',
//     Answer: 'His',
//     Difficulty_level: 1,
//     Exercise_id: new mongoose.Types.ObjectId("6537f23a406e8ee2f1bf78ad"),
//     Language_id: new mongoose.Types.ObjectId("6537dbadaf291dd8be4e171a"),
//     __v: 0
//   }
// ]

// async function insertQuestions() {
//   try {
//     // Iterate through the question data array
//     for (const question of questArray) {
//       const answer = new Answers({
//         user: userId,
//         Question: question._id,
//         Exercise_id: question.Exercise_id,
//         Language_id: question.Language_id,
//       });
//       await answer.save();
//     }
//     console.log("Questions inserted into the Answers collection successfully.");
//   } catch (error) {
//     console.error("Error inserting questions:", error);
//   }s
// }
// insertQuestions();


// _execute.updateA();
// _execute.updateB();
// _execute.updateC();



const PORT = process.env.PORT || 2000;
app.listen(PORT, () => logger.info(`server started at port ${PORT}`));
