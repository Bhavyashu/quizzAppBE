const { reset } = require("nodemon");
const { User, Questions, Language, Exercise, Progress } = require("../models/");
const { addOptions } = require("../utils/utils");
const { Success, HttpError } = require("../utils/httpResponse");
const { errors } = require('../error/errors');
// const {}
const {
  getCompletedQuestions,
  getNextQuestion,
  getQuestionsWithAnswers,
  updateScore,
} = require("../utils/userProgress");





const getLanguages = async (req, res) => {
  try {
    const userId = req.user.id;
      // If user_id is provided in the query params, retrieve user's preferred languages
      const user = await User.findById(userId)
      .select("preffered_languge -_id")
      .populate({
         path: "preffered_languge.language",
         select: "name"
      });
      

      if (user) {
        const response = new Success(
          "Languages for the user fetched Successfully",
          user
        );
        res.status(response.statusCode).json(response);
        // const response = { data: user.preffered_languge };
        // res.json(response);
      } else {
        const { name, code } = errors[404];
        const response = new HttpError("User not found", name, {}, code);
        res.status(404).json(response);
      }
  } catch (error) {
    const { name, code } = errors[500];
    const response = new HttpError("Internal Server Error", name, error, code);
    res.status(404).json(response);
  }
};

// const getExercises = async (req, res) => {
//   try {
//     // console.log("here");
//     const language_id = req.query.language_id;
//     // console.log(language_id);
//     if (!language_id) {
//       return res
//         .status(400)
//         .json({ message: "Missing language id in req.params" });
//     }
//     // console.log(language_id);
//     // Retrieve all exercises (categories) for the specified language
//     const exercises = await Exercise.find({ language: language_id });
//     // console.log("these are the exercises", exercises);
//     res.json(exercises);
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// };

const getExercises = async (req, res) => {
  try {
    const userId = req.user.id;
    const language_id = req.query.language_id;
    let returnObj = []
    console.log("language_id: && userId" + language_id+ "userId: " + userId);
    if (!language_id) {
      return res.status(400).json({ message: "Missing language id in req.params" });
    }

    // Retrieve all exercises (categories) for the specified language
    const exercises = await Exercise.find({ language: language_id });
    console.log("exercises: " + exercises.length);

    const userProgress = await Progress.findOne({
      user: userId,
    });
    console.log("here under userProgress: " + userProgress);
    if (!userProgress) {
      // If there is no user progress, all exercises are considered incomplete
      returnObj = exercises.map((exercise) => ({
        ...exercise.toObject(),
        completed: 0, // No completed questions
      }));
    } else {
      console.log("here");
      // If user progress exists, find the completed questions for each exercise
      returnObj = exercises.map((exercise) => {
        const completedQuestions = userProgress.languageProgress.find(
          (progress) => progress.language.equals(exercise.language)
        )?.exercises.find((e) => e.exercise.equals(exercise._id))?.completedQuestions;

        return {
          ...exercise.toObject(),
          completed: completedQuestions ? completedQuestions.length : 0,
        };
      });
      console.log("FInal data :",returnObj );
    }

    res.json(returnObj);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const getQuestion = async (req, res) => {
  try {
    const userId = req.user.id // You should have user information in your request, adjust as needed
    const exerciseId  = req.query.eid; // Replace with the actual exercise ID
    let languageId = req.query.lid || 0;
    // console.log(exerciseId);
    languageId  =(!languageId)? await (Exercise.findById(exerciseId).select("language")):languageId;
    const answererdQuestions = await getCompletedQuestions(userId, languageId, exerciseId)

    const unansweredQuestion = await Questions.find({
      _id: {
        $nin: answererdQuestions.map(
          (completedQuestion) => completedQuestion._id
        ),
      },
    })
      .select('-__v')
      .sort({ Difficulty_level: 1 })
      .limit(1)
      .exec();

    if (unansweredQuestion) {
      const unansweredQuestionObj = unansweredQuestion[0].toObject();
      unansweredQuestionObj.Answer = addOptions([unansweredQuestionObj.Answer]);
      res.status(200).json(unansweredQuestionObj);
    } else {
      res.status(404).json({ message: 'No unanswered questions found for this exercise.' });
    }
  } catch (error) {
    console.error('Error getting question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
// });
};

const verifyAns = async (req, res) => {
  try {
    const userId = req.user.id;
    const { qid, answer, excerId, difficulty,langId } = req.body;
    // console.log(typeof qid === "string");
    const allQuestions = await getQuestionsWithAnswers(excerId);
    let isCorrect = false;

   for(let i = 0; i < allQuestions.length; i++) {
      const obj  =  allQuestions[i];
      if(obj._id.toString() === qid){
        console.log(`this is the user answer ${answer} this is the real answer ${obj.Answer}`);
        if(obj.Answer == answer){
          updateScore(userId, langId, obj.Difficulty_level);
          isCorrect = true;
        }
        break; 
      }
   }
   console.log(isCorrect);

    // console.log(`\n ==============${testQuestion} ${correctAns} ${questionDifficulty} ${excerId} ${langId} =================================================================\n `)

    const completedQuestions = await getCompletedQuestions(
      userId,
      langId,
      excerId,
      isCorrect,
      qid
    );
    // console.log("this is the useer questions \n ", completedQuestions);
    const response = await getNextQuestion(
      isCorrect,
      difficulty,
      completedQuestions,
      allQuestions
    );


    // console.log(completedQuestions);
    res.json({...response[0], previousAnswer: isCorrect});
    // console.log(ans);
    // res.send("fsf");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// async function getQuestionsWithAnswers(eid) {
//   if (answerCache[eid]) {
//     // Return cached data if available
//     return answerCache[eid];
//   } else {
//     // Fetch data from the database
//     const allQuestions = await Questions.find(
//       { Exercise_id: eid },
//       "_id Question Answer Difficulty_level Exercise_id Language_id"
//     ).sort({ Difficulty_level: 1 });

//     // Cache the answers
//     answerCache[eid] = allQuestions;

//     return allQuestions;
//   }
// }


module.exports = {
  getLanguages,
  getExercises,
  getQuestion,
  verifyAns,
};
