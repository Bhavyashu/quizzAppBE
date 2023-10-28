const jwt = require('jsonwebtoken');

const { HttpError } = require('../utils/httpResponse');

const { errors } = require('../error');

const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRY,
} = process.env;

const generateToken = (user, tokenType) => {
  const secret =
    (tokenType === "refresh" ? JWT_REFRESH_SECRET : JWT_ACCESS_SECRET) ||
    "secret";
  const expiry =
    (tokenType === "refresh" ? JWT_REFRESH_EXPIRY : JWT_ACCESS_EXPIRY) || "1d";
  // console.log(`this is the secret : ${secret}, this is the expiry : ${expiry}`);
  const token = jwt.sign({ id: user.id, name: user.name,  user_type: user.password }, secret, {
    expiresIn: expiry,
  });

  if (token) {
    return token;
  }
  return null;
};

const verifyAccessToken = (req, res, next) => {
  try {
    // console.log(req.headers);
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);
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
