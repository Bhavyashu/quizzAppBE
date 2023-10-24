const { User } = require("../models/user"); // Assuming you have a User model
const { Success, HttpError, isHttpError } = require("../utils/httpResponse");

const verifyUser = async (req, res, next) => {
  const { email } = req.body;

  // Regular expression to validate email format
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format. Please enter a valid email address.",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  // If the email format is valid, proceed to the next middleware
  next();
};

module.exports = { verifyUser };
