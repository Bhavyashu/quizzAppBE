const asyncHandler = require("express-async-handler");
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");

// models 
const { User, Questions, Language, Exercise, Progress } = require("../models/");
const { addOptions } = require("../utils/utils");

const {
  getCompletedQuestions,
  getNextQuestion,
  getQuestionsWithAnswers,
  updateScore,
} = require("../utils/userProgress");

const getLanguages = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  // If user_id is provided in the query params, retrieve user's preferred languages
  const user = await User.findById(userId)
    .select("preffered_languge -_id")
    .populate({
      path: "preffered_languge.language",
      select: "name",
    });

  const response = new Success(
    "Languages for the user fetched Successfully",
    user
  );
  res.status(response.statusCode).json(response);
});


const getExercises = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  const language_id = req.query.language_id;
  let returnObj = [];

  if (!language_id) {
    const { name, code } = err[404];
    throw new HttpError("language_id params missing in the request params", name, [], code);
  }

  const exercises = await Exercise.find({ language: language_id });;

  const userProgress = await Progress.findOne({
    user: userId,
  });
  
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
      const completedQuestions = userProgress.languageProgress
        .find((progress) => progress.language.equals(exercise.language))
        ?.exercises.find((e) =>
          e.exercise.equals(exercise._id)
        )?.completedQuestions;

      return {
        ...exercise.toObject(),
        completed: completedQuestions ? completedQuestions.length : 0,
      };
    });
    // console.log("FInal data :", returnObj);
  }
  const response = new Success(
    "Languages for the user fetched Successfully",
    returnObj
  );
  res.status(response.statusCode).json(response);
});

const getQuestion = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; // You should have user information in your request, adjust as needed
  const exerciseId = req.query.eid; // Replace with the actual exercise ID
  console.log(`this is the exerciseId : ${exerciseId}`);
  let languageId = req.query.lid || 0;
  console.log(`this is the languageId : ${!languageId}`);
  // console.log(exerciseId);
  languageId = !languageId
    ? await Exercise.findById(exerciseId).select("language")
    : languageId;
  const answererdQuestions = await getCompletedQuestions(
    userId,
    languageId,
    exerciseId
  );

  const unansweredQuestion = await Questions.find({
    _id: {
      $nin: answererdQuestions.map(
        (completedQuestion) => completedQuestion._id
      ),
    },
    Exercise_id: exerciseId, // Replace 'excerId' with the variable holding the value
    Language_id: languageId, // Replace 'langId' with the variable holding the value
  })
    .select("-__v")
    .sort({ Difficulty_level: 1 })
    .limit(1)
    .exec();

  if (unansweredQuestion) {
    const unansweredQuestionObj = unansweredQuestion[0].toObject();
    unansweredQuestionObj.Answer = addOptions([unansweredQuestionObj.Answer]);
    res.status(200).json(unansweredQuestionObj);
  } else {
    res
      .status(200)
      .json({ message: "No unanswered questions found for this exercise." });
  }
});

const verifyAns = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { qid, answer, excerId, difficulty, langId } = req.body;
  // console.log("--------------------------------",qid, answer, excerId, difficulty, langId, "--------------------------------");
  // console.log(typeof qid === "string");
  const allQuestions = await getQuestionsWithAnswers(excerId);
  console.log(allQuestions.length);
  let isCorrect = false;

  for (let i = 0; i < allQuestions.length; i++) {
    const obj = allQuestions[i];
    if (obj._id == qid) {
      
      if (obj.Answer == answer) {
        updateScore(userId, langId, obj.Difficulty_level);
        isCorrect = true;
      }
      break;
    }
    else{
      console.log("inside else block");
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
  res.json({ ...response[0], previousAnswer: isCorrect });
});

module.exports = {
  getLanguages,
  getExercises,
  getQuestion,
  verifyAns,
};
