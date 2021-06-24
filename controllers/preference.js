const Preference = require("../models/preference");
const User = require("../models/user");

exports.setPreferences = async (req, res, next) => {
  try {
    const user = req.userData.id;
    const { fandoms } = req.body;
    const preferences = await Preference.findOne({ user });
    if (preferences) {
      preferences.fandoms = fandoms;
      await preferences.save();
    } else {
      await Preference.create({ user, fandoms });
      await User.findByIdAndUpdate(user, { isInitializedPreferences: true });
    }
    return res.status(200).json({
      message: "Preference set."
    });
  } catch (err) {
    next(err);
  }
};

exports.getPreferences = async (req, res, next) => {
  try {
    const user = req.userData.id;
    const preferences = await Preference.findOne({ user });
    return res.status(200).json({
      message: "Successful get preference.",
      preferences: preferences.fandoms ? preferences.fandoms : []
    });
  } catch (err) {
    next(err);
  }
};