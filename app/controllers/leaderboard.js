const { User, Language } = require("../models");
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { Http } = require("winston/lib/winston/transports");

// Get the leaderboard based on overall score
const globalBoard = asyncHandler(async(req, res) => {
  // Step 1: Match users with an overall score greater than 0
  const leaderboard = await User.aggregate([
    {
      $match: {
        over_all_score: { $gt: 0 },
      },
    },
    // Step 2: Unwind the 'preffered_languge' array
    {
      $unwind: "$preffered_languge",
    },
    // Step 3: Filter users with preferred languages having a score greater than 0
    {
      $match: {
        "preffered_languge.score": { $gt: 0 },
      },
    },
    // Step 4: Perform a lookup to get language details
    {
      $lookup: {
        from: "languages",
        localField: "preffered_languge.language",
        foreignField: "_id",
        as: "languageDetails",
      },
    },
    // Step 5: Unwind the 'languageDetails' array
    {
      $unwind: "$languageDetails",
    },
    // Step 6: Project the fields needed for the response
    {
      $project: {
        name: 1,
        "preffered_languge.language": "$languageDetails.name",
        "preffered_languge.score": 1,
        "preffered_languge.proficiency": 1,
        over_all_score: 1,
      },
    },
    // Step 7: Group users to form the leaderboard structure
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        preffered_languages: {
          $push: {
            language: "$preffered_languge.language",
            score: "$preffered_languge.score",
            proficiency: "$preffered_languge.proficiency",
          },
        },
        over_all_score: { $max: "$over_all_score" },
      },
    },
    // Step 8: Sort the leaderboard by overall score in descending order
    {
      $sort: {
        over_all_score: -1,
      },
    },
  ]);

  // Check if the leaderboard data is available
  if (!leaderboard) {
    const { name, code } = err[500];
    throw new HttpError("Failed to fetch the leaderboard data", name, leaderboard, code);
  }

  // Prepare a success response with the leaderboard data
  const response = new Success("Leaderboard Data fetched successfully", leaderboard, 200);

  res.status(200).json(response);
});


// Get the leaderboard based on a specific language
const languageBoard = asyncHandler(async(req, res) => {
  // Step 1: Extract the 'lid' parameter from the request query and convert it to a valid mongoose ObjectId
  const { lid: lanId } = req.query;
  const languageId = new mongoose.Types.ObjectId(lanId);

  // Step 2: Match users with the specified language having scores greater than 0
  const leaderboard = await User.aggregate([
    {
      $match: {
        "preffered_languge.language": languageId,
        "preffered_languge.score": { $gt: 0 },
      },
    },
    // Step 3: Unwind the 'preffered_languge' array
    {
      $unwind: "$preffered_languge",
    },
    // Step 4: Filter users with preferred languages having a score greater than 0 for the specified language
    {
      $match: {
        "preffered_languge.language": languageId,
        "preffered_languge.score": { $gt: 0 },
      },
    },
    // Step 5: Sort the users based on the preferred language score in descending order
    {
      $sort: {
        "preffered_languge.score": -1,
      },
    },
    // Step 6: Perform a lookup to get language details from the 'languages' collection
    {
      $lookup: {
        from: "languages", // Replace 'languages' with the actual name of your Language collection
        localField: "preffered_languge.language",
        foreignField: "_id",
        as: "languageDetails",
      },
    },
    // Step 7: Unwind the 'languageDetails' array
    {
      $unwind: "$languageDetails",
    },
    // Step 8: Group users to form the leaderboard structure
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        over_all_score: { $first: "$preffered_languge.score" },
        preffered_languages: {
          $push: {
            language: "$languageDetails.name", // Use the language name
            proficiency: "$preffered_languge.proficiency",
            score : "$preffered_languge.score"
          },
        },
      },
    },
    // Step 9: Sort the leaderboard by overall score in descending order
    {
      $sort: {
        over_all_score: -1,
      },
    },
    // Step 10: Project the final fields needed for the response
    {
      $project: {
        _id: 1,
        name: 1,
        preffered_languages: 1,
        over_all_score: 1,
      },
    },
  ]);

  // Check if the leaderboard data is available
  if (!leaderboard) {
    const { name, code } = err[500];
    throw new HttpError(`Failed to fetch the leaderboard for the language ${languageId}`, name, leaderboard, code);
  }

  // Prepare a success response with the leaderboard data
  const response = new Success("Leaderboard Data fetched successfully", leaderboard, 200);

  res.status(200).json(response);
});


module.exports = {
  globalBoard,
  languageBoard,
};
