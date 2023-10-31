const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");
const { proficiencyLabels } = require( "./constants");

const {
  User,
  Exercise,
  Questions,
  Language,
  Answers,
  Progress,
} = require("../models");
const { addOptions } = require("./utils");

const answerCache = {};


const getProgress = async (userId, LanguagesId) => {
  const respObj = {};
  const progressPromises = LanguagesId.map((languageId) => {
    return getProgressPerLanguage(userId, languageId);
  });

  try {
    const results = await Promise.all(progressPromises);
    // const responseObj = {};
    for (let i = 0; i < LanguagesId.length; i++) {
      getExcercisesObject(LanguagesId[i]);
      const LanguageName = await Language.findOne(
        { _id: LanguagesId[i] },
        { name: 1, _id: 0 }
      );
      respObj[LanguageName.name] = results[i];
    }
    return respObj;
    // console.log("this is the final one \n",responseObj);
  } catch (error) {
    console.error("Error calculating progress:", error);
  }
};

const getExcercisesObject = async (langugeId) => {
  const excercises = await Exercise.find(
    { language: langugeId },
    { name: 1, _id: 1 }
  );
  console.log("This is the eccercises map", excercises);
};


const getCompletedQuestions = asyncHandler(async (
  userId,
  languageId,
  exerciseId,
  isCorrect = false,
  questionId = false
) => {
    let userPerformance = await Progress.findOne({ user: userId });

    if (!userPerformance) {
      // If the user's performance data doesn't exist, you can create it.
      userPerformance = new Progress({
        user: userId,
        languageProgress: [],
      });
    }

    let languageProgress = userPerformance.languageProgress.find((lp) =>
      lp.language.equals(languageId)
    );
    if (!languageProgress) {
      languageProgress = { language: languageId, exercises: [] };
      userPerformance.languageProgress.push(languageProgress);
    }

    let exerciseProgress = languageProgress.exercises.find((ep) =>
      ep.exercise.equals(exerciseId)
    );
    if (!exerciseProgress) {
      exerciseProgress = { exercise: exerciseId, completedQuestions: [] };
      languageProgress.exercises.push(exerciseProgress);
    }

    if (
      !exerciseProgress.completedQuestions.includes(questionId) &&
      isCorrect &&
      questionId
    ) {
      // console.log(`=========================    new quesiton correct answer  =======================================`);
      exerciseProgress.completedQuestions.push(questionId);
    }

    // Save the updated performance data back to the database
    userPerformance.save();
    // console.log(savedUserPerformance);

    // Return the array of completed questions for the specified exerciseId
    const completedQuestions = exerciseProgress.completedQuestions;
    return completedQuestions;
});


const getNextQuestion = asyncHandler(async (
  isCorrect,
  questionDifficulty,
  completedQuestions,
  allQuestions
) => {

  const questionArray = [];
  if (completedQuestions.length == allQuestions.length) {
    return questionArray;
  }

  // if the answer is correct / wrong manipulate the answer
  questionDifficulty = questionDifficulty += isCorrect ? 1 : -1;
  questionDifficulty =
    questionDifficulty <= 0
      ? 1
      : questionDifficulty > 5
      ? 5
      : questionDifficulty;

  const difficultyLevelMap = {};

  // Build the difficulty level map TC =  O(5*m))
  for (let i = 1; i <= 5; i++) {
    difficultyLevelMap[i] = allQuestions
      .filter((question) => question.Difficulty_level === i)
      .filter((question) => !completedQuestions.includes(question._id));
  }


  // Check for available questions at the specified difficulty level
  if (difficultyLevelMap[questionDifficulty].length > 0) {
    const obj = difficultyLevelMap[questionDifficulty][0].toObject();
    obj.Answer = addOptions([obj.Answer]);
    questionArray.push(obj);
    return questionArray;
  }

  const originalDifficulty = questionDifficulty;
  let difficultyIncrement = isCorrect ? +1 : -1;


  // this while loop will iterate 5 times at it will keep incrementing/decrementing the difficulty and then from the map get the 
  while (true) {
    questionDifficulty += difficultyIncrement;

    // if we have reached where the questionDifficulty is <0 then the user has answered all the questions who's difficulty is less than the original difficulty
    if (questionDifficulty < 1) {
      difficultyIncrement = 1;
      questionDifficulty = originalDifficulty + difficultyIncrement;
    }

    // if we have reached where the questionDifficulty is >5 that means the user has have answered all the questions who's difficulty is greater than the original difficulty
    if (questionDifficulty > 5) {
      difficultyIncrement = -1;
      questionDifficulty = originalDifficulty + difficultyIncrement;
    }

    // if there exists an unanswered question for this qifficulty level then get the question details and send the array 
    if (difficultyLevelMap[questionDifficulty].length > 0) {
      const obj = difficultyLevelMap[questionDifficulty][0].toObject();
      obj.Answer = addOptions([obj.Answer]);
      questionArray.push(obj);
      return questionArray;
    }
  }
});


const updateScore = asyncHandler(async(userId, languageId, addPoints) => {


    const user = await User.findById(userId);
    const { total_score } = await Language.findById(languageId);

    const preferredLanguageEntry = user.preffered_languge.find(
      (entry) => entry.language.toString() === languageId.toString()
    );

    if (!preferredLanguageEntry) {
      throw new Error("Preferred language not found");
    }

    // Update the language-specific score
    preferredLanguageEntry.score += addPoints;

    const user_score = preferredLanguageEntry.score;
    // Calculate the user's proficiency level
    const user_proficiency = updateProficiency(user_score, total_score);

    // updating the leaderboard score

    preferredLanguageEntry.proficiency=user_proficiency;
    user.over_all_score += addPoints;


    // Save the user object with the updated scores
    await user.save();
});


const updateProficiency = (user_score, total_score)=>{

  // Calculate the range size based on the total_score
  const rangeSize = total_score / proficiencyLabels.length;

  // Calculate the user's proficiency level
  let proficiencyLabel;

  // Find the user's proficiency level based on their score
  for (let i = 0; i < proficiencyLabels.length; i++) {
    const rangeStart = i * rangeSize;
    const rangeEnd = (i + 1) * rangeSize;

    if (user_score >= rangeStart && user_score < rangeEnd) {
      proficiencyLabel = proficiencyLabels[i];
      break;
    }
  }
  return proficiencyLabel
};

async function getQuestionsWithAnswers(eid) {
  if (answerCache[eid]) {
    // Return cached data if available
    return answerCache[eid];
  } else {
    // Fetch data from the database
    const allQuestions = await Questions.find(
      { Exercise_id: eid },
      "_id Question Answer Difficulty_level Exercise_id Language_id"
    ).sort({ Difficulty_level: 1 });

    // Cache the answers
    answerCache[eid] = allQuestions;

    return allQuestions;
  }
}
module.exports = {
  getProgress,
  getExcercisesObject,
  getCompletedQuestions,
  getNextQuestion,
  getQuestionsWithAnswers,
  updateScore,
};
