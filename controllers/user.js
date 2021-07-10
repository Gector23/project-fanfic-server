const User = require("../models/user");
const Fanfic = require("../models/fanfic");
const Favorite = require("../models/favorite");

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const projection = "_id isActivated isInitializedPreferences isAdmin lastSignIn email login signUp lastUpdate";
    const user = await User.findById(userId, projection)
      .populate({ path: "preferences", select: "_id name" });
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
    const user = await User.findById(userId, "preferences isInitializedPreferences lastUpdate");
    if (!user) {
      throw new Error("User not found.");
    }
    user.preferences = fandoms;
    if (!user.isInitializedPreferences) {
      user.isInitializedPreferences = true;
    }
    user.lastUpdate = Date.now();
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
    const { sortField, sortDirection, pageSize, currentPage, fandom } = req.query;
    let fanficsQuery;
    let maxFanfics;
    if (fandom && fandom !== "all") {
      maxFanfics = await Fanfic.find({ user: userId, fandom }, "_id name").countDocuments();
      fanficsQuery = Fanfic.find({ user: userId, fandom }, "_id name");
    } else {
      maxFanfics = await Fanfic.find({ user: userId }, "_id name").countDocuments();
      fanficsQuery = Fanfic.find({ user: userId }, "_id name");
    }
    if (sortField && sortDirection) {
      fanficsQuery.sort(`${sortDirection === "down" ? "-" : ""}${sortField}`);
    }
    if (pageSize && currentPage) {
      fanficsQuery.skip(pageSize * (currentPage - 1)).limit(+pageSize);
    }
    const fanfics = await fanficsQuery;
    return res.status(200).json({
      message: "Successful user fanfics query.",
      data: fanfics,
      maxFanfics
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserFavorites = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { sortField, sortDirection, pageSize, currentPage, fandom } = req.query;
    const favorites = await Favorite.find({ user: userId }, "fanfic");
    const fanficsIds = favorites.map(favorite => favorite.fanfic);
    let fanficsQuery;
    let maxFanfics;
    if (fandom && fandom !== "all") {
      maxFanfics = await Fanfic.find({ _id: fanficsIds, fandom }, "_id name").countDocuments();
      fanficsQuery = Fanfic.find({ _id: fanficsIds, fandom }, "_id name");
    } else {
      maxFanfics = await Fanfic.find({ _id: fanficsIds }, "_id name").countDocuments();
      fanficsQuery = Fanfic.find({ _id: fanficsIds }, "_id name");
    }
    if (sortField && sortDirection) {
      fanficsQuery.sort(`${sortDirection === "down" ? "-" : ""}${sortField}`);
    }
    if (pageSize && currentPage) {
      fanficsQuery.skip(pageSize * (currentPage - 1)).limit(+pageSize);
    }
    const fanfics = await fanficsQuery;
    return res.status(200).json({
      message: "Successful user favorites query.",
      data: fanfics,
      maxFanfics
    });
  } catch (err) {
    next(err);
  }
};