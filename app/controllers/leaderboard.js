const { User, Language } = require("../models");
const { Success, HttpError } = require("../utils/httpResponse");
const { errors: err } = require("../error/errors");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const { Http } = require("winston/lib/winston/transports");

// Get the leaderboard based on overall score
const globalBoard = asyncHandler(async(req, res) =>{
    const leaderboard = await User.aggregate([
      {
        $match: {
          over_all_score: { $gt: 0 }, // Filter users with overall score > 0
        },
      },
      {
        $unwind: "$preffered_languge",
      },
      {
        $match: {
          "preffered_languge.score": { $gt: 0 }, // Filter preferred languages with score > 0
        },
      },
      {
        $lookup: {
          from: "languages", // Replace 'languages' with the actual name of your Language collection
          localField: "preffered_languge.language",
          foreignField: "_id",
          as: "languageDetails",
        },
      },
      {
        $unwind: "$languageDetails",
      },
      {
        $project: {
          name: 1,
          "preffered_languge.language": "$languageDetails.name",
          "preffered_languge.score": 1,
          "preffered_languge.proficiency": 1,
          over_all_score: 1,
        },
      },
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
      {
        $sort: {
          over_all_score: -1,
        },
      },
    ]);

    if(!leaderboard){
      const {name , code } = err[500]
      throw new HttpError("Failed to fetch the leaderboard data", name, leaderboard,code );
    }
    const response =  new Success("Leaderboard Data fetched successfully", leaderboard, 200);

    res.status(200).json(response);
  });

// Get the leaderboard based on a specific language
const languageBoard = asyncHandler(async(req, res) =>{
  const { lid: lanId } = req.query;
  const languageId = new mongoose.Types.ObjectId(lanId);

    const leaderboard = await User.aggregate([
      {
        $match: {
          "preffered_languge.language": languageId,
          "preffered_languge.score": { $gt: 0 }, // Filter scores greater than 0
        },
      },
      {
        $unwind: "$preffered_languge",
      },
      {
        $match: {
          "preffered_languge.language": languageId,
          "preffered_languge.score": { $gt: 0 }, // Filter scores greater than 0
        },
      },
      {
        $sort: {
          "preffered_languge.score": -1,
        },
      },
      {
        $lookup: {
          from: "languages", // Replace 'languages' with the actual name of your Language collection
          localField: "preffered_languge.language",
          foreignField: "_id",
          as: "languageDetails",
        },
      },
      {
        $unwind: "$languageDetails",
      },
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
      {
        $sort: {
          over_all_score: -1,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          preffered_languages: 1,
          over_all_score: 1,
        },
      },
    ]);

    if(!leaderboard){
      const {name , code } = err[500]
      throw new HttpError(`Failed to fetch the leaderboard for the language ${languageId}`, name, leaderboard,code );
    }
    const response =  new Success("Leaderboard Data fetched successfully", leaderboard, 200);

    res.status(200).json(response);
  });

module.exports = {
  globalBoard,
  languageBoard,
};
