const {User,Language} = require('../models');
const mongoose = require('mongoose');

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
        $unwind: '$preffered_languge',
      },
      {
        $match: {
          'preffered_languge.score': { $gt: 0 }, // Filter preferred languages with score > 0
        },
      },
      {
        $lookup: {
          from: 'languages', // Replace 'languages' with the actual name of your Language collection
          localField: 'preffered_languge.language',
          foreignField: '_id',
          as: 'languageDetails',
        },
      },
      {
        $unwind: '$languageDetails',
      },
      {
        $project: {
          name: 1,
          over_all_score: 1,
          'preffered_languge.language': '$languageDetails.name',
          'preffered_languge.score': 1,
          'preffered_languge.proficiency': 1,
        },
      },
      {
        $sort: {
          over_all_score: -1,
        },
      },
    ]);

    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Get the leaderboard based on a specific language
async function languageBoard(req, res) {
  const {lid:lanId} = req.query;
  const languageId= new mongoose.Types.ObjectId(lanId);
  try {
    const leaderboard = await User.aggregate([
      {
        $match: {
          'preffered_languge.language': languageId,
        },
      },
      {
        $unwind: '$preffered_languge',
      },
      {
        $match: {
          'preffered_languge.language': languageId,
          'preffered_languge.score': { $gt: 0 }, // Filter scores greater than 0
        },
      },
      {
        $sort: {
          'preffered_languge.score': -1,
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          score: { $first: '$preffered_languge.score' },
        },
      },
      {
        $sort: {
          score: -1,
        },
      },
    ]);

    console.log("this is the result of the query", leaderboard);
    res.json(leaderboard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
globalBoard,
  languageBoard,
};
