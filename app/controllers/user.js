const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { User, Exercise, Language, Questions, Answers } = require("../models"); // Assuming you have a User model
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");
const { generateToken } = require("../middlewares/auth");
const { calculatePercentage } = require("../utils/utils");
const { getLanguages } = require("./quiz");
const { getLanguagesId } = require("../utils/user");
// const { getProgressPerLanguage, getProgress } = require("../utils/userProgress");

// User registration route
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, preferred_languages } = req.body;

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    score: 0,
    preffered_languge: preferred_languages.map((languageId) => ({
      language: languageId,
    })),
  });
  await newUser.save();

  const response = new Success("User created Successfully");
  res.status(response.statusCode).json(response);
});

// User login route
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const responseObj = {};
  const user = await User.findOne({ email }).populate({
    path: "preffered_languge.language",
    select: "name -_id", // Include only the "name" field
  });

  if (!user) {
    const { name, code } = err[404];
    throw new HttpError("Invalid Email", name, [], code);
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    const { name, code } = err[404];
    throw new HttpError("Invalid Password", name, [], code);
  }
  responseObj.name = user.name;
  responseObj.email = user.email;
  // Generate a JWT token
  const accessToken = generateToken(user);
  const refreshToken = generateToken(user, "refresh");
  const response = new Success(
    "Login successful",
    { ...responseObj, accessToken, refreshToken },
    200
  );
  res.status(response.statusCode).json(response);
});

// User profile route (protected by JWT)
const profile = asyncHandler(async (req, res, next) => {
  const user = req.user.id;

  const userDetails = await User.findOne({ _id: user })
    .select(" -_id -password -__v")
    .populate({
      path: "preffered_languge.language",
      select: "name -_id", // Include only the "name" field
    });

  const response = new Success(
    "User Profile Fetched Successfully",
    userDetails,
    200
  );
  res.status(response.statusCode).json(response);
});

const addLanguage = asyncHandler(async (req, res, next) => {
  const { language: langId } = req.body;
  const userId = req.user.id;
  console.log(`user id ${userId}`);

  const user = await User.findById(userId);

  const languageExists = user.preffered_languge.some((lang) =>
    lang.language.equals(langId)
  );

  if (languageExists) {
    const { name, code } = err[400];
    throw new HttpError("Language Already In Use", name, [], code);
  }

  user.preffered_languge.push({
    language: langId,
  });

  // Save the user's profile with the updated language
  user.save();

  const response = new Success(
    "Language Added Successfully",
    {},
    200
  );
  res.status(response.statusCode).json(response);
});

const progress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  const { preffered_languge } = user;

  const LanguagesId = [];
  preffered_languge.forEach((obj) => {
    LanguagesId.push(obj.language);
  });

  console.log(LanguagesId)

  // const responseObj = await getProgress(userId, LanguagesId);

  // console.log("\n UserAnswersFoun", userAnswers.length, "\n");
  // let counter = 0;
  // for (const answer of userAnswers) {
  //   const languageId = answer.Language_id;
  //   const exerciseId = answer.Exercise_id;

  //   const exercise = await Exercise.findById(exerciseId);
  //   const totalQuestions = Questions.countDocuments({
  //     Exercise_id : exerciseId
  //   })
  //   const language = await Language.findById(languageId);

  //   // console.log(`\n This is the userprogress object ${userProgress} \n`);
  //   if (!userProgress[language.name]) {
  //     userProgress[language.name] = {};
  //   }

  //   // Count the number of answers for this exercise and language
  //   const count = await Answers.countDocuments({
  //     user: userId,
  //     Language_id: languageId,
  //     Exercise_id: exerciseId,
  //   });
  //   const percentage = ((count / totalQuestions) * 100).toFixed(2) + "%";

  //   userProgress[language.name][exercise.name] = { percentage };
  // }

  const response = new Success("User Details", {}, 200);
  res.status(response.statusCode).json(response);
});
module.exports = {
  register,
  login,
  profile,
  addLanguage,
  progress,
};
