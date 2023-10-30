const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const {
  User,
  Exercise,
  Language,
  Questions,
  Answers,
  Progress,
} = require("../models"); // Assuming you have a User model
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");
const { generateToken } = require("../middlewares/auth");
const { calculatePercentage } = require("../utils/utils");
const {
  getLanguagesId,
  addLangDetails,
  getUserLanguages,
} = require("../utils/user");
const mongoose = require("mongoose");
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
  console.log(user);
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
  console.log(req.body);
  const { languageId: langId } = req.body;
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

  const response = new Success("Language Added Successfully", {}, 200);
  res.status(response.statusCode).json(response);
});

const progress = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userData = await Progress.aggregate([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) },
    },
    {
      $unwind: "$languageProgress",
    },
    {
      $unwind: "$languageProgress.exercises",
    },
    {
      $lookup: {
        from: "languages",
        localField: "languageProgress.language",
        foreignField: "_id",
        as: "languageDetails",
      },
    },
    {
      $lookup: {
        from: "exercises",
        localField: "languageProgress.exercises.exercise",
        foreignField: "_id",
        as: "exerciseInfo",
      },
    },
    {
      $project: {
        langid: "$languageProgress.language",
        langScore: { $arrayElemAt: ["$languageDetails.total_score", 0] },
        langname: { $arrayElemAt: ["$languageDetails.name", 0] },
        exerciseName: { $arrayElemAt: ["$exerciseInfo.name", 0] },
        completedQuestions: {
          $size: "$languageProgress.exercises.completedQuestions",
        },
        totalQuestions: { $arrayElemAt: ["$exerciseInfo.Questions", 0] },
      },
    },
    {
      $group: {
        _id: "$langid",
        name: { $first: "$langname" },
        total_score: { $first: "$langScore" },
        userProgress: {
          $push: {
            exerciseName: "$exerciseName",
            completedQuestions: "$completedQuestions",
            totalQuestions: "$totalQuestions",
          },
        },
      },
    },
    {
      $addFields: {
        totalCompletedQuestions: {
          $sum: "$userProgress.completedQuestions",
        },
      },
    },
    {
      $sort: { totalCompletedQuestions: -1 },
    },
    {
      $unset: "totalCompletedQuestions",
    },
  ]);

  const data = await addLangDetails(userId, userData);
  // console.log(data);

  const response = new Success("User Details", data, 200);
  res.status(response.statusCode).json(response);
});

const getLanguages = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const userData = await getUserLanguages(userId);
  const languageIds = userData.preffered_languge.map(
    (item) => item.language._id
  );
  const allLanguages = await getUserLanguages(userId, languageIds);
  // const returnArrayObj = [];
  res
    .status(200)
    .json({ preffered_languge: userData.preffered_languge, allLanguages });
});

const resetProgress = asyncHandler(async (req, res) => {
  const { languageId: langId } = req.body;
  const userId = req.user.id;

  // Reset the user's score and proficiency for the specified language
  const updateUserDocument = await User.updateOne(
    { _id: userId, "preffered_languge.language": langId },
    {
      $set: {
        "preffered_languge.$.score": 0,
        "preffered_languge.$.proficiency": "Beginner",
      },
    }
  );
  console.log(`updated user successfully`, JSON.stringify(updateUserDocument,null, 2));

  // Empty the completedQuestions array for exercises associated with langId
  const updateUserProgress = await Progress.updateMany(
    {
      user: userId,
      "languageProgress.language": langId,
    },
    {
      $set: { "languageProgress.$.exercises.$[].completedQuestions": [] },
    }
  );
  console.log(`updated user progress successfully`, JSON.stringify(updateUserProgress,null, 2));
  
  res.status(200).json({ message: "Successfully Reset the data" });
});

module.exports = {
  register,
  login,
  profile,
  addLanguage,
  progress,
  getLanguages,
  resetProgress,
};
