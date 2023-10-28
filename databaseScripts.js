const { Language, Exercise, Questions, Answers } = require("./app/models");

const updateA = async () => {
  try {
    // Language.aggregate([
    //   {
    //     $lookup: {
    //       from: 'exercises', // Replace with the actual name of your questions collection
    //       localField: '_id',
    //       foreignField: 'language',
    //       as: 'questions',
    //     },
    //   },
    //   {
    //     $set: {
    //       exercises: { $size: '$questions' },
    //     },
    //   },
    // ])
    //   .then((results) => {
    //     // Update the Language documents with the calculated total_questions
    //     return Promise.all(
    //       results.map((result) => {
    //         return Language.updateOne({ _id: result._id }, { $set: { exercises: result.exercises } });
    //       })
    //     );
    //   })
    //   .then(() => {
    //     console.log('Total questions updated successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error updating total questions:', error);
    //   });
    // console.log("this is the result of update A", result);
  } catch (e) {
    console.log("Error: " + e.message);
  }
};

const updateB = async () => {
  try {
    // const result = await Language.updateMany({}, [
    //     {
    //       $set: {
    //         total_questions: {
    //           $sum: {
    //             $map: {
    //               input: {
    //                 $map: {
    //                   input: {
    //                     $filter: {
    //                       input: "$questions",
    //                       as: "question",
    //                       cond: { $eq: ["$$question.language", "$_id"] },
    //                     },
    //                   },
    //                   as: "q",
    //                   in: "$$q._id",
    //                 },
    //               },
    //               as: "questionIds",
    //               in: {
    //                 $toObjectId: "$$questionIds",
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ]);
    //   console.log("this is the result of update B", result);
  } catch (e) {
    console.log("Error: " + e.message);
  }
};

const updateC = async () => {
    // try {
    //     const result = await Language.updateMany({}, [
    //         {
    //           $set: {
    //             total_score: {
    //               $sum: {
    //                 $map: {
    //                   input: {
    //                     $map: {
    //                       input: {
    //                         $filter: {
    //                           input: "$questions",
    //                           as: "question",
    //                           cond: { $eq: ["$$question.language", "$_id"] },
    //                         },
    //                       },
    //                       as: "q",
    //                       in: "$$q.Difficulty_level",
    //                     },
    //                   },
    //                   as: "difficultyLevels",
    //                   in: "$$difficultyLevels",
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       ]);
    //       console.log("this is the result of update C", result);
    // } catch (e) {
    //   console.log("Error: " + e.message);
    // }
  };
module.exports = {
  updateA,
  updateB,
  updateC,
};
