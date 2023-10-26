const { reset } = require("nodemon");
const { User, Questions, Language, Exercise } = require("../models/");
const { addOptions } = require('../utils/utils');
const { updateUserProgress, getNextQuestion } = require('../utils/userProgress');

const getLanguages = async (req, res) => {
  try {
    const userId = req.user.id;
    if (userId) {
      // If user_id is provided in the query params, retrieve user's preferred languages
      const user = await User.findById(userId).populate(
        "preffered_languge.language"
      );
      if (user) {
        const response = {data : user.preffered_languge};
        res.json(response);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      // Retrieve all languages
      const languages = await Language.find();
      res.json(languages);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExercises = async (req, res) => {
  try {
    // console.log("here");
    const language_id  = req.query.language_id;
    // console.log(language_id);
    if (!language_id) {
      return res
        .status(400)
        .json({ message: "Missing language id in req.params" });
    }
    // console.log(language_id);
    // Retrieve all exercises (categories) for the specified language
    const exercises = await Exercise.find({ language: language_id });
    // console.log("these are the exercises", exercises);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: error});
  }
};


const getQuestons = async (req, res) => {
  try {
    const language_id = req.query.language_id;
    const exercise_id = req.query.exercise_id;
    let respObj = [];
    if (!exercise_id) {
      return res.status(400).json({
        message: "Missing exercise_id query parameters",
      });
    }

    // Retrieve all questions for the specified language and exercise
    const questions = await Questions.find({
      Exercise_id: exercise_id,
    });
    // console.log("questions", questions);
    questions.forEach((question)=>{
        // console.log(question.Answer);
        const nestedObject = {
            qid : question._id,
            Question: question.Question,
            Answer: addOptions([question.Answer]),
            Difficulty_level: question.Difficulty_level
        }
        respObj.push(nestedObject);
    });
    res.json(respObj);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyAns =  async (req, res) => {
    const userId = req.user.id;
    const {qid, answer} = req.body;
    const allQuestions = await Questions.find({}, '_id Answer Difficulty_level Exercise_id Language_id');
    let isCorrect = false;
    let questionDifficulty = 0;
    let langId;
    let excerId;
    let userExcercises;
    allQuestions.forEach((question)=>{
        if(qid == question._id){
            questionDifficulty = question.Difficulty_level;
            langId = question.Language_id,
            excerId = question.Exercise_id
            if(answer == question.Answer){
                isCorrect = true;
            }
        }
    });
    // console.log(` THIS IS THE EXCER ID ${excerId}`);
    completedQuestions = await updateUserProgress(isCorrect,userId,langId,excerId,qid);
    console.log("this is the useer questions \n ", completedQuestions);
    const response = getNextQuestion(isCorrect, questionDifficulty, completedQuestions, allQuestions);

    // console.log(completedQuestions);
    res.json(response);
    // console.log(ans);
    // res.send("fsf");
};

module.exports = {
  getLanguages,
  getExercises,
  getQuestons,
  verifyAns,
};
