const { User, Questions, Language, Exercise } = require("../models/");


const getLanguages = async (req, res) => {
  try {
      const languages = await Language.find().select("_id name");
      res.json(languages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExercises = async (req, res) => {
  try {
    const language_id = req.query.language_id;
    if (!language_id) {
      return res
        .status(400)
        .json({ message: "Missing language_id query parameter" });
    }
    console.log(language_id);
    // Retrieve all exercises (categories) for the specified language
    const exercises = await Exercise.find({ language: language_id });
    console.log("these are the exercises", exercises);
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


const getQuestions = async (req, res) => {
  try {
    // const language_id = req.query.language_id;
    const exercise_id = req.query.exercise_id;

    if (!exercise_id) {
      return res.status(400).json({
        message: "Missing exercise_id in query parameters",
      });
    }

    // Retrieve all questions for the specified language and exercise
    const questions = await Questions.find({
      Exercise_id: exercise_id,
    });

    console.log(questions.length);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addLanguages = async (req, res) => {
  try {
    // Get the language string from req.body
    const language = req.body.language;

    // Add your asynchronous logic here, e.g., working with promises
    const result = new Language({
      name: language,
    }); // Replace with your actual async function
    await result.save();
    // Check the result of your async operation
    if (result) {
      // Send a success response
      console.log("this is the result for adding languages", result ,"\n");
      res
        .status(200)
        .json({ success: true, message: "Language added successfully", result: result });
    } else {
      // Send a failure response
      res
        .status(400)
        .json({ success: false, message: "Failed to add language" });
    }
  } catch (error) {
    // Handle any errors that may occur during processing
    console.error("An error occurred:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addExercises = async (req, res) => {
  try{
  const {language_id, name, description}  = req.body;

  const result = new Exercise({
    name,
    description,
    language: language_id,
  });

  await result.save();
  if (result) {
    // Send a success response
    console.log("this is the result for adding languages", result ,"\n");
    res
      .status(200)
      .json({ success: true, message: "Exercise added successfully", result: result });
  } else {
    // Send a failure response
    res
      .status(400)
      .json({ success: false, message: "Failed to add Exercise" });
  }
} catch (error) {
  // Handle any errors that may occur during processing
  console.error("An error occurred:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const addQuestions = async (req, res) => {
  try{
    const {Language_id, Exercise_id, Question, Answer, Difficulty_level, }  = req.body;

    const ExerciseRecord = await Exercise.findById(Exercise_id);
    ExerciseRecord.Questions +=1;
    ExerciseRecord.save();
  
    const result = new Questions({
      Language_id, 
      Exercise_id, 
      Question, 
      Answer, 
      Difficulty_level
    });
  
    await result.save();
    if (result) {
      // Send a success response
      console.log("this is the result for adding languages", result ,"\n");
      res
        .status(200)
        .json({ success: true, message: "Question added successfully", result: result });
    } else {
      // Send a failure response
      res
        .status(400)
        .json({ success: false, message: "Failed to add Question" });
    }
  } catch (error) {
    // Handle any errors that may occur during processing
    console.error("An error occurred:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
    }
};
module.exports = {
  getLanguages,
  getExercises,
  getQuestions,
  addLanguages,
  addExercises,
  addQuestions
};
