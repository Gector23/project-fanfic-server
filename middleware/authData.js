const tokenService = require("../services/tokenService");

module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return next();
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return next();
    }
    const tokenPayload = tokenService.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET);
    if (!tokenPayload) {
      return next();
    }
    req.userData = tokenPayload;
    next();
  } catch (err) {
    next(err);
  }
};