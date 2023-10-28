const { User, Language } = require("../models");
const mongoose = require("mongoose");

// Get the leaderboard based on overall score
async function globalBoard(req, res) {
  try {
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

    res.status(200).json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Get the leaderboard based on a specific language
async function languageBoard(req, res) {
  const { lid: lanId } = req.query;
  const languageId = new mongoose.Types.ObjectId(lanId);
  try {
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

    console.log("this is the result of the query", leaderboard);
    res.status(200).json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  globalBoard,
  languageBoard,
};
