const bcrypt = require("bcrypt");
const { User, Exercise, Language, Questions, Answers } = require("../models"); // Assuming you have a User model
const { Success, HttpError } = require("../utils/httpResponse");
const { generateToken } = require("../middlewares/auth");
const { calculatePercentage } = require("../utils/utils");
const { getProgressPerLanguage, getProgress } = require("../utils/progress");

// User registration route
const register = async (req, res) => {
  try {
    const { name, email, password, preferred_language_ids } = req.body;

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Assuming preferred_language_ids is an array of valid language ObjectIDs
      score: 0,
      preffered_languge: preferred_language_ids.map((languageId) => ({
        language: languageId,
      })),
    });

    await newUser.save();

    // const accessToken = generateToken(newUser);
    // const refreshToken = generateToken(newUser, "refresh");

    const response = new Success("User created Successfully");
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed." });
  }
};

// User login route
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const responseObj = {};

    // Find the user by email
    // const user = await User.findOne({ email }).select(' -_id -__v')
    // .populate({
    //   path: 'preffered_languge.language',
    //   select: 'name -_id', // Include only the "name" field
    // })

    const user = await User.findOne({ email }).populate({
      path: "preffered_languge.language",
      select: "name -_id", // Include only the "name" field
    });
    // .select(' -_id -__v')
    // .populate({
    //   path: 'preffered_languge.language',
    //   select: 'name -_id', // Include only the "name" field
    // })
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }
    responseObj.name = user.name;
    responseObj.email = user.email;
    responseObj.language = [];
    user.preffered_languge.forEach((object) => {
      responseObj.language.push(object.language.name);
    });

    // Generate a JWT token
    const accessToken = generateToken(user);
    const refreshToken = generateToken(user, "refresh");
    const response = new Success(
      "Login successful",
      { ...responseObj, accessToken, refreshToken },
      200
    );
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed." });
  }
};

// User profile route (protected by JWT)
const profile = async (req, res) => {
  // The user object is attached to the request by the JWT middleware
  console.log(req.user);
  const user = req.user.id;
  //  console.log();

  // You can use the `user` object to retrieve user-specific data
  // For example, you can fetch user data from the database and send it as a response
  const userDetails = await User.findOne({ _id: user })
    .select(" -_id -password -__v")
    .populate({
      path: "preffered_languge.language",
      select: "name -_id", // Include only the "name" field
    });

  const response = new Success("User Details", userDetails, 200);
  res.status(response.statusCode).json(response);
};

const addLanguage = async (req, res) => {
  try {
    const { language: langId } = req.body;
    const userId = req.user.id;
    console.log(`user id ${userId}`);

    const user = await User.findById(userId);
    // Add the new preferred language to the user's profile
    user.preffered_languge.push({
      language: langId,
    }),
      // Save the user's profile with the updated language
      await user.save();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed." });
  }
};

const progress = async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId);
    userId = user._id;

    if (!user) {
      return { message: "User not found" };
    }

    const { preffered_languge } = user;

    const LanguagesId = [];
    preffered_languge.forEach((obj) => {
      LanguagesId.push(obj.language);
    });


    const responseObj = await getProgress(userId,LanguagesId);
    // console.log(userAnswers);

    // console.log("\n UserAnswersFoun", userAnswers.length, "\n");
    // let counter = 0;
    // for (const answer of userAnswers) {
    //   const languageId = answer.Language_id;
    //   const exerciseId = answer.Exercise_id;

    //   const exercise = await Exercise.findById(exerciseId);
    //   const totalQuestions = Questions.countDocuments({
    //     Exercise_id : exerciseId
    //   })
    //   const language = await Language.findById(languageId);

    //   // console.log(`\n This is the userprogress object ${userProgress} \n`);
    //   if (!userProgress[language.name]) {
    //     userProgress[language.name] = {};
    //   }

    //   // Count the number of answers for this exercise and language
    //   const count = await Answers.countDocuments({
    //     user: userId,
    //     Language_id: languageId,
    //     Exercise_id: exerciseId,
    //   });
    //   const percentage = ((count / totalQuestions) * 100).toFixed(2) + "%";

    //   userProgress[language.name][exercise.name] = { percentage };
    // }

    const response = new Success("User Details", responseObj, 200);
    res.status(response.statusCode).json(response);
  } catch (error) {
    console.error("Error calculating user progress:", error);
    return { error: "Error calculating user progress" };
  }
};
module.exports = {
  register,
  login,
  profile,
  addLanguage,
  progress,
};
