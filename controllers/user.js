const User = require("../models/user");
const Fanfic = require("../models/fanfic");
const Favorite = require("../models/favorite");

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const projection = "_id isActivated isInitializedPreferences isAdmin lastSignIn email login signUp lastUpdate";
    const user = await User.findById(userId, projection);
    if (!user) {
      throw new Error("User not found.");
    }
    return res.status(200).json({
      message: "Successful user query.",
      user
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserUpdate = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "lastUpdate");
    if (!user) {
      throw new Error("User not found.");
    }
    return res.status(200).json({
      message: "Successful user last update query.",
      lastUpdate: user.lastUpdate
    });
  } catch (err) {
    next(err);
  }
};

exports.setPreferences = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { fandoms } = req.body;
    const user = await User.findById(userId, "preferences isInitializedPreferences");
    if (!user) {
      throw new Error("User not found.");
    }
    user.preferences = fandoms;
    if (!user.isInitializedPreferences) {
      user.isInitializedPreferences = true;
    }
    await user.save();
    return res.status(200).json({
      message: "Preferences set."
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserFanfics = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const fanfics = await Fanfic.find({ user: userId }, "_id name");
    return res.status(200).json({
      message: "Successful user fanfics query.",
      fanfics
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const favorites = await Favorite.find({ user: userId }, "_id name");
    return res.status(200).json({
      message: "Successful user favorites query.",
      favorites
    });
  } catch (err) {
    next(err);
  }
};