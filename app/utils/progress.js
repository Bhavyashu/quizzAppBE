const mongoose = require("mongoose");
const { User, Exercise, Questions, Language, Answers, Progress } = require("../models");

const getProgressPerLanguage = async (userId, langugeId) => {
  try{
    const pipeline = [
      {
        $match: {
          user: userId,
          Language_id: langugeId,
        },
      },
      {
        $group: {
          _id: "$Exercise_id",
          count: { $sum: 1 },
        },
      },
    ];

    const exerciseProgress = await Answers.aggregate(pipeline);
    // console.log(typeof exerciseProgress);
    // console.log(`This is the exercises progress for ${userId} language ${langugeId} :  ${exerciseProgress}`);
    // console.log(`\n This is the exercises progress ${JSON.stringify(exerciseProgress)} \n`);

    const progressObject = {};
    for (const item of exerciseProgress) {
      const exerciseId = item._id;

      // Lookup the Exercise name by Exercise_id
      const exerciseData = await Exercise.findOne(
        { _id: exerciseId },
        { name: 1, _id: 0, Questions : 1 }
      );

      progressObject[exerciseData.name] = ((item.count / exerciseData.Questions)*100).toFixed(2)+'%';
    }

    // console.log("Exercise Progress:", progressObject);
    return progressObject;
  } catch (error) {
    console.error("Error calculating exercise progress:", error);
  }
};

const getProgress = async(userId, LanguagesId) => {
  const respObj = {};
  const progressPromises = LanguagesId.map((languageId) => {
    return getProgressPerLanguage(userId,languageId);
  });

    try {
      const results = await Promise.all(progressPromises);
      // const responseObj = {};
      for (let i = 0; i < LanguagesId.length; i++) {
        getExcercisesObject(LanguagesId[i]);
        const LanguageName = await Language.findOne(
          { _id: LanguagesId[i] },
          { name: 1, _id: 0 }
        );
        respObj[LanguageName.name] = results[i];
      }
      return respObj;
      // console.log("this is the final one \n",responseObj);
    } catch (error) {
      console.error("Error calculating progress:", error);
    }
};

const getExcercisesObject = async(langugeId) =>{
  const excercises = await Exercise.find(
    {language : langugeId},
    { name: 1, _id: 1 }
    );
  console.log("This is the eccercises map",excercises);
};

// const updateUserProgress = async(userId, languageId, exerciseId, questionId) =>{
//     try {
//       let userPerformance = await Progress.findOne({ user: userId });
  
//       if (!userPerformance) {
//         // If the user's performance data doesn't exist, you can create it.
//         userPerformance = new Progress({
//           user: userId,
//           languageProgress: [],
//         });
//       }
  
//       let languageProgress = userPerformance.languageProgress.find(lp => lp.language.equals(languageId));
//       if (!languageProgress) {
//         languageProgress = { language: languageId, exercises: [] };
//         userPerformance.languageProgress.push(languageProgress);
//       }
  
//       let exerciseProgress = languageProgress.exercises.find(ep => ep.exercise.equals(exerciseId));
//       if (!exerciseProgress) {
//         exerciseProgress = { exercise: exerciseId, completedQuestions: [] };
//         languageProgress.exercises.push(exerciseProgress);
//       }
  
//       if (!exerciseProgress.completedQuestions.includes(questionId)) {
//         exerciseProgress.completedQuestions.push(questionId);
//       }
  
//       // Save the updated performance data back to the database
//       const savedUserPerformance = await userPerformance.save();
//       return savedUserPerformance;
//     } catch (error) {
//       // Handle errors
//       console.error(error);
//     }
// }


const updateUserProgress = async (userId, languageId, exerciseId, questionId) => {
  try {
    let userPerformance = await Progress.findOne({ user: userId });
    console.log(JSON.parse(JSON.stringify(userPerformance)));

    if (!userPerformance) {
      // If the user's performance data doesn't exist, you can create it.
      userPerformance = new Progress({
        user: userId,
        languageProgress: [],
      });
    }

    let languageProgress = userPerformance.languageProgress.find(lp => lp.language.equals(languageId));
    if (!languageProgress) {
      languageProgress = { language: languageId, exercises: [] };
      userPerformance.languageProgress.push(languageProgress);
    }

    let exerciseProgress = languageProgress.exercises.find(ep => ep.exercise.equals(exerciseId));
    if (!exerciseProgress) {
      exerciseProgress = { exercise: exerciseId, completedQuestions: [] };
      languageProgress.exercises.push(exerciseProgress);
    }

    if (!exerciseProgress.completedQuestions.includes(questionId)) {
      exerciseProgress.completedQuestions.push(questionId);
    }

    // Save the updated performance data back to the database
    const savedUserPerformance = await userPerformance.save();

    // Return the array of completed questions for the specified exerciseId
    const completedQuestionsForExercise = exerciseProgress.completedQuestions;
    return {completedQuestions: completedQuestionsForExercise };
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}



module.exports = {
    getProgressPerLanguage,
    getProgress,
    updateUserProgress
}