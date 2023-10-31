const asyncHandler = require("express-async-handler");
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");

// models 
const { User, Questions, Exercise, Progress } = require("../models/");
const { addOptions } = require("../utils/utils");


//util functions for user handling
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
    
  }
  const response = new Success(
    "Languages for the user fetched Successfully",
    returnObj
  );
  res.status(response.statusCode).json(response);
});



const getQuestion = asyncHandler(async (req, res, next) => {
  const userId = req.user.id; 
  const exerciseId = req.query.eid; 

  let languageId = req.query.lid || 0;

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
    Exercise_id: exerciseId, 
    Language_id: languageId, 
  })
    .select("-__v")
    .sort({ Difficulty_level: 1 })
    .limit(1)
    .exec();

  if(!unansweredQuestion){
    const {name , code } = err[500]
    throw new HttpError(`couldn't get the questions for the user ${userId}`, name, unansweredQuestion,code );
  }

  if (unansweredQuestion && unansweredQuestion.length > 0) {
    const unansweredQuestionObj = unansweredQuestion[0].toObject();
    unansweredQuestionObj.Answer = addOptions([unansweredQuestionObj?.Answer]);
    const response =  new Success('Next question for the user fetched',{...unansweredQuestionObj},200);
    res.status(response.statusCode).json(response);
  } else {
    const response =  new Success('No unanswered questions found for this exercise',{},200);
    res.status(response.statusCode).json(response);
  }
});


const verifyAns = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { qid, answer, excerId, difficulty, langId } = req.body;
  
  const allQuestions = await getQuestionsWithAnswers(excerId);

  if(!allQuestions){
    const {name , code } = err[500]
    throw new HttpError(`Failed to verify the answered for the qid ${qid}`, name, allQuestions,code );
  }
 

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
  }


  const completedQuestions = await getCompletedQuestions(
    userId,
    langId,
    excerId,
    isCorrect,
    qid
  );
  if(!completedQuestions){
    const {name , code } = err[500]
    throw new HttpError(`couldn't get the list of completed questions for the user ${userId}`, name, completedQuestions,code );
  }


  const nextQuestion = await getNextQuestion(
    isCorrect,
    difficulty,
    completedQuestions,
    allQuestions
  );

  if(!nextQuestion){
    const {name , code } = err[500]
    throw new HttpError(`couldn't get the next question for the user ${userId}`, name, nextQuestion,code );
  }

  const respoData = {
    ...nextQuestion[0],
    previousAnswer: isCorrect
  }
  
  const response =  new Success("Leaderboard Data fetched successfully", respoData, 200);
  res.status(response.statusCode).json(response);
});

module.exports = {
  getLanguages,
  getExercises,
  getQuestion,
  verifyAns,
};
