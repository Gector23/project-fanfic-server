const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const { _id: authId } = req.userData;
    if (authId) {
      const user = await User.findById(authId, "isBlocked");
      if (!user) {
        throw new Error("Account deleted.");
      }
      if (user.isBlocked) {
        throw new Error("You are blocked.");
      }  
    }
    next();
  } catch (err) {
    next(err);
  }
};