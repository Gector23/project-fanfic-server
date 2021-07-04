const tokenService = require("../services/tokenService");

module.exports = (req, res, next) => {
  try {
    if (!req.userData) {
      throw new Error("Auth failed.");
    }
    next();
  } catch (err) {
    next(err);
  }
};