const { User, Questions, Language, Exercise } = require("../models/");
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");
const asyncHandler = require("express-async-handler");

const getLanguages = asyncHandler(async (req, res) => {
  const languages = await Language.find().select("_id name");

  if (!languages) {
    const { name, code } = err[500];
    throw new HttpError(
      "Error fetching the langauages feom the database",
      name,
      [],
      code
    );
  }

  const response = new Success("Success", languages, 200);
  res.status(response.statusCode).json(response);
});

const getExercises = asyncHandler(async (req, res) => {
  const language_id = req.query.language_id;

  if (!language_id) {
    const { name, code } = err[400];
    throw new HttpError("missing language_id in params", name, [], code);
  }

  // Retrieve all exercises (categories) for the specified language
  const exercises = await Exercise.find({ language: language_id });

  const response = new Success("fetched exercises", exercises, 200);
  res.status(response.statusCode).json(response);
});

const getQuestions = asyncHandler(async (req, res) => {
  const exercise_id = req.query.exercise_id;

  if (!exercise_id) {
    const { name, code } = err[400];
    throw new HttpError("missing exercise_id in params", name, [], code);
  }

  // Retrieve all questions for the specified language and exercise
  const questions = await Questions.find({
    Exercise_id: exercise_id,
  });

  const response = new Success(
    "fetched questions successfully",
    questions,
    200
  );
  res.status(response.statusCode).json(response);
});

const addLanguages = asyncHandler(async (req, res) => {
  const { language } = req.body;

  if (!language) {
    const { name, code } = err[400];
    throw new HttpError(
      "language property is required in the req/body",
      name,
      [],
      code
    );
  }

  const result = new Language({
    name: language,
  });

  await result.save();

  if (result) {
    const response = new Success(
      "Language added, visible to live users now",
      result,
      200
    );
    res.status(response.statusCode).json(response);
  } else {
    const { name, code } = err[500];
    const response = new HttpError(
      "failed to save the language in the database",
      name,
      result,
      code
    );
    res.status(response.statusCode).json(response);
  }
});

const addExercises = asyncHandler(async (req, res) => {
  const { language_id, name, description } = req.body;

  if (!name || !description || !language_id) {
    const { name: errorName, code } = err[400];
    throw new HttpError(
      "missing important required details in req.body to full fill the database",
      errorName,
      [],
      code
    );
  }

  const LanguageRecord = await Language.findById(language_id);

  const result = new Exercise({
    name,
    description,
    language: language_id,
  });

  await result.save();

  if (result) {
    // increment the langauge data for that language
    LanguageRecord.exercises += 1;
    LanguageRecord.save();
    const response = new Success("Exercises added, visible to live users now", result, 200);
    res.status(response.statusCode).json(response);
  } else {
    const { name, code } = err[500];
    const response = new HttpError(
      "failed to save the exercise in the database",
      name,
      result,
      code
    );
    res.status(response.statusCode).json(response);
  }
});

const addQuestions = asyncHandler(async (req, res) => {
  const { Language_id, Exercise_id, Question, Answer, Difficulty_level } =
    req.body;

  if ((!Language_id, !Exercise_id, !Question, !Answer, !Difficulty_level)) {
    const { name: errorName, code } = err[400];
    throw new HttpError(
      "missing important required details in req.body to full fill the database",
      errorName,
      [],
      code
    );
  }

  const ExerciseRecord = await Exercise.findById(Exercise_id);

  const result = new Questions({
    Language_id,
    Exercise_id,
    Question,
    Answer,
    Difficulty_level,
  });

  await result.save();

  if (result) {
    const LanguageRecord = await Language.findById(Language_id);
    ExerciseRecord.Questions += 1;
    LanguageRecord.total_questions += 1;
    LanguageRecord.total_score += Difficulty_level;
    ExerciseRecord.save();
    LanguageRecord.save();

    const response = new Success("Questions added, visible to live users now", result, 200);
    res.status(response.statusCode).json(response);
  } else {
    const { name, code } = err[500];
    const response = new HttpError(
      "failed to save the exercise in the database",
      name,
      result,
      code
    );
    res.status(response.statusCode).json(response);
  }
});

module.exports = {
  getLanguages,
  getExercises,
  getQuestions,
  addLanguages,
  addExercises,
  addQuestions,
};
