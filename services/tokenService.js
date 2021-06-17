const jwt = require("jsonwebtoken");

const Token = require("../models/token");

exports.generateTokens = payload => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return {
    accessToken,
    refreshToken
  };
};

exports.verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

exports.saveRefreshToken = async (user, refreshToken) => {
  const token = await Token.findOne({ user });
  if (token) {
    token.refreshToken = refreshToken;
    await token.save();
  } else {
    await Token.create({ user: user._id, refreshToken });
  }
};

exports.removeRefreshToken = async refreshToken => {
  await Token.deleteOne({ refreshToken });
};

exports.findRefreshToken = async refreshToken => {
  return await Token.findOne({ refreshToken });
};