const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const {
  User,
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


/**
 * Registers a new user.
 *
 * @param {object} req - The user registration request.
 * @param {object} res - The response to the user registration request.
 */
const register = asyncHandler(async (req, res) => {
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

  const response = new Success("User created Successfully",{},200);
  res.status(response.statusCode).json(response);
});

/**
 * Logs in an existing user.
 *
 * @param {object} req - The user login request.
 * @param {object} res - The response to the user login request.
 */
const login = asyncHandler(async (req, res) => {
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


/**
 * Fetches the user's profile.
 *
 * @param {object} req - The user profile request.
 * @param {object} res - The response to the user profile request.
 */
const profile = asyncHandler(async (req, res) => {
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



/**
 * Fetches the user's progress data.
 *
 * @param {object} req - The request to fetch user progress data.
 * @param {object} res - The response to the progress data request.
 */
const progress = asyncHandler(async (req, res) => {
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



/**
 * Fetches the user's preferred languages.
 *
 * @param {object} req - The request to fetch preferred languages.
 * @param {object} res - The response to the fetch languages request.
 */
const getLanguages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userData = await getUserLanguages(userId);

  const languageIds = userData.preffered_languge.map(
    (item) => item.language
  );
  const allLanguages = await getUserLanguages(userId, languageIds);
  // const returnArrayObj = [];
  const responseData = {
     preffered_languge: userData.preffered_languge, allLanguages
  }
  const response = new Success("Language Added Successfully", responseData, 200);
  res.status(response.statusCode).json(response);
});


/**
 * Adds a new language to the user's preferred languages.
 *
 * @param {object} req - The request to add a new language.
 * @param {object} res - The response to the add language request.
 */
const addLanguage = asyncHandler(async (req, res) => {
  const { languageId: langId } = req.body;

  if(!langId){
    const { name, code } = err[400];
    throw new HttpError("required language",name,langId,code);
  }
  const userId = req.user.id;
  

    const user = await User.findById(userId);
   

    const languageExists = user.preffered_languge.some((lang) =>
      lang.language.toString() == (langId)
    );
   

    if (languageExists) {
   
     const {name, code} = err[400];
      const errorResponse = new HttpError(
        "Language Already In Use",
        name,
        [],
        code
      );
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
   

    // Language doesn't exist, add it
    user.preffered_languge.push({
      language: langId,
    });
   

    // Save the user's profile with the updated language
    const savedSuccessfully = await user.save();
   

    const responseData ={
      acknowledged : (savedSuccessfully)?true:false,
    }
   
    // Language added successfully response
    const successResponse = new Success(
      "Language Added Successfully",
      responseData,
      200
    );
    res.status(successResponse.statusCode).json(successResponse);
});






/**
 * Resets the user's progress data for a specific language.
 *
 * @param {object} req - The request to reset language progress.
 * @param {object} res - The response to the reset progress request.
 */
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

  const response = new Success("Language Data Reset Successfully", updateUserProgress, 200);
  res.status(response.statusCode).json(response);
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
