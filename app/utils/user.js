const { User, Exercise, Language, Questions, Answers } = require("../models");

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

module.exports = {getLanguagesId}