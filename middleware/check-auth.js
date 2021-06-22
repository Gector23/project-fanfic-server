const tokenService = require("../services/tokenService");

module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new Error("Auth failed.");
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      throw new Error("Auth failed.");
    }
    const tokenPayload = tokenService.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET);
    if (!tokenPayload) {
      throw new Error("Auth failed.");
    }
    req.userData = tokenPayload;
    next();
  } catch (err) {
    next(err);
  }
};