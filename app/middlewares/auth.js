const jwt = require('jsonwebtoken');

const { HttpError } = require('../utils/httpResponse');

const { errors } = require('../error');

const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
} = process.env;

/**
 * Generates a token for the given user and token type.
 *
 * @param {Object} user - The user object.
 * @param {string} tokenType - The type of token to generate.
 * @return {string|null} The generated token or null if unable to generate.
 */
const generateToken = (user, tokenType) => {
  const secret =
    (tokenType === "refresh" ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET) ||
    "secret";
  const expiry =
    (tokenType === "refresh" ? JWT_REFRESH_EXPIRY : JWT_ACCESS_EXPIRY) || "1d";
  console.log(`this is the secret : ${secret}, this is the expiry : ${expiry}`);
  const token = jwt.sign({ id: user.id, user_type: user.password }, secret, {
    expiresIn: expiry,
  });

  if (token) {
    return token;
  }
  return null;
};

/**
 * Verify the access token in the request headers.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @return {void}
 */
const verifyAccessToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(req.headers);
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    // console.log("this is the decoded token", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    const { name, code } = errors[401];
    const response = new HttpError("Please login again", name, [], code);
    return res.status(response.statusCode).json(response);
  }
};

module.exports = {
  generateToken,
  verifyAccessToken, 
};
