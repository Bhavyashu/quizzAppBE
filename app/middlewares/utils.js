const { User } = require("../models/user"); // Assuming you have a User model
const { Success, HttpError, isHttpError } = require("../utils/httpResponse");
const {errors} = require("../error/errors");

const verifyUser = async (req, res, next) => {
  const { email } = req.body;

  // Regular expression to validate email format
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    const{name, code} = errors[400];
    const response = new HttpError('Invalid email format. Please enter a valid email address.',name,{},code)
    return res.status(response.statusCode).json(response);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log("this is the name and code");
    const {name, code} = errors[400];
    console.log("this is the name and code", name, code);
    const response = new HttpError('User already exists.',name,{},code)
    return res.status(response.statusCode).json(response);
  }

  // If the email format is valid, proceed to the next middleware
  next();
};

module.exports = { verifyUser };
