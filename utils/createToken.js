const jwt = require("jsonwebtoken");

// generate token
const createToken = (payLoad) =>
  jwt.sign({ userId: payLoad }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });

module.exports = createToken;