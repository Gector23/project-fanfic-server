const tokenService = require("../services/tokenService");
const userService = require("../services/userService");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      req.userData = {};
      return next();
    }
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      req.userData = {};
      return next();
    }
    const tokenPayload = tokenService.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET);
    if (!tokenPayload) {
      req.userData = {};
      return next();
    }
    req.userData = tokenPayload;
    if (tokenPayload.isAdmin) {
      req.userData.isAdmin = await userService.isAdmin(tokenPayload._id);
    }
    next();
  } catch (err) {
    next(err);
  }
};