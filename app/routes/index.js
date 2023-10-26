const express = require("express");
const router = express.Router();
const { User, Questions, Language, Exercise } = require("../models");
router.use("/user", require("./user"));
router.use('/quiz', require('./quiz'));
router.use('/admin', require('./admin'));

// Import your Mongoose models (Language, User, Exercise, Questions)

// 1. Get Languages
// router.get("/languages", async (req, res) => {
//   try {
//     if (req.query.user_id) {
//       // If user_id is provided in the query params, retrieve user's preferred languages
//       const user = await User.findById(req.query.user_id).populate(
//         "preffered_languge.language"
//       );
//       if (user) {
//         res.json(user.preffered_languge);
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } else {
//       // Retrieve all languages
//       const languages = await Language.find();
//       res.json(languages);
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // 2. Get Exercises
// router.get("/exercises", async (req, res) => {
//   try {
//     const language_id = req.query.language_id;
//     if (!language_id) {
//       return res
//         .status(400)
//         .json({ message: "Missing language_id query parameter" });
//     }
//     console.log(language_id);
//     // Retrieve all exercises (categories) for the specified language
//     const exercises = await Exercise.find({ language: language_id });
//     console.log("these are the exercises", exercises);
//     res.json(exercises);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// // 3. Get Questions
// router.get("/questions", async (req, res) => {
//   try {
//     const language_id = req.query.language_id;
//     const exercise_id = req.query.exercise_id;

//     if (!language_id || !exercise_id) {
//       return res
//         .status(400)
//         .json({
//           message: "Missing language_id or exercise_id query parameters",
//         });
//     }

//     // Retrieve all questions for the specified language and exercise
//     const questions = await Questions.find({
//       Language_id: language_id,
//       Exercise_id: exercise_id,
//     });
//     console.log(questions.length);
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.post("/addLanguage", 
// });

module.exports = router;
