const { User, Exercise, Language, Questions, Answers } = require("../models");
const asyncHandler = require("express-async-handler");
const getLanguagesId = async(preferredLanguages) =>{
    try {
      // Fetch all languages with name and _id fields
      const allLanguages = await Language.find({}, 'name _id');
      
      // Create a map for quick lookups
      const languageMap = new Map();
      allLanguages.forEach(language => {
        languageMap.set(language.name, language._id);
      });
  
      // Find the object IDs for the preferred languages
      const languageIds = preferredLanguages.map(languageName => languageMap.get(languageName)).filter(Boolean);
  
      return languageIds;
    } catch (error) {
      console.error('Error while fetching language IDs:', error);
      throw error;
    }
};

const addLangDetails = async (userId, userData) => {
    console.log("this is userId:", userId);
    const user = await User.findById(userId).select('preffered_languge');
    // console.log(`this is the user data`, user)
    // Find the preferred language for the given langId
    userData.forEach((languageSection)=>{
    const preferredLanguage = user.preffered_languge.find(
      (language) => (language.language.toString()==languageSection._id.toString())
    );
    languageSection.score = preferredLanguage?.score;
    languageSection.proficiency = preferredLanguage?.proficiency;
    });
    return userData
};


module.exports = {getLanguagesId, addLangDetails}