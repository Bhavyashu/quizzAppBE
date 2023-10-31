const { User, Language, } = require("../models");
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

const getUserLanguages = async(userId, excludeIds=false) =>{
  try{
  if(excludeIds){
    const languages = await Language.find({ _id: { $nin: excludeIds } }).select("_id name total_score exercises questions total_questions");
    return languages;
  }else{
  const userLanguages = await User.findById(userId)
  .select("preffered_languge -_id ")
  .populate({
    path: "preffered_languge.language",
    select: "name",
  });
  return userLanguages;
}
}catch(e){
  console.log(e);
}
};
module.exports = {getLanguagesId, addLangDetails, getUserLanguages}