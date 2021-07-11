const User = require("../models/user");
const Fanfic = require("../models/fanfic");
const Favorite = require("../models/favorite");

const userService = require("../services/userService");

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const projection = `_id isActivated isInitializedPreferences isAdmin isBlocked lastSignIn email login signUp
    lastUpdate`;
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

exports.getUsers = async (req, res, next) => {
  try {
    const { pageSize, currentPage } = req.query;
    let usersQuery = User.find({}, "_id login");
    let maxUsers = await User.find().countDocuments();
    if (pageSize && currentPage) {
      usersQuery.skip(pageSize * (currentPage - 1)).limit(+pageSize);
    }
    const users = await usersQuery;
    return res.status(200).json({
      message: "Successful users query.",
      data: users,
      maxUsers
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
    const { _id: authId } = req.userData;
    const userId = req.params.userId;
    if (userId === authId) {
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
    } else {
      throw new Error("No access rights.");
    }
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

exports.setAdmin = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "isAdmin");
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.isAdmin) {
      throw new Error("Already admin.");
    }
    user.isAdmin = true;
    user.lastUpdate = Date.now();
    await user.save();
    return res.status(200).json({
      message: "Successful user admin set."
    });
  } catch (err) {
    next(err);
  }
};

exports.removeAdmin = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "isAdmin");
    if (!user) {
      throw new Error("User not found.");
    }
    if (!user.isAdmin) {
      throw new Error("Not admin.");
    }
    user.isAdmin = false;
    await user.save();
    user.lastUpdate = Date.now();
    return res.status(200).json({
      message: "Successful user admin remove."
    });
  } catch (err) {
    next(err);
  }
};

exports.block = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "isBlocked");
    if (!user) {
      throw new Error("User not found.");
    }
    if (user.isBlocked) {
      throw new Error("Already blocked.");
    }
    user.isBlocked = true;
    await user.save();
    user.lastUpdate = Date.now();
    return res.status(200).json({
      message: "Successful user block."
    });
  } catch (err) {
    next(err);
  }
};

exports.unblock = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, "isBlocked");
    if (!user) {
      throw new Error("User not found.");
    }
    if (!user.isBlocked) {
      throw new Error("Not blocked.");
    }
    user.isBlocked = false;
    await user.save();
    user.lastUpdate = Date.now();
    return res.status(200).json({
      message: "Successful user unblock."
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const isAdmin = req.userData.isAdmin;
    const userId = req.params.userId;
    if (isAdmin) {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error("User not found.");
      }
      await userService.removeUserData(userId);
      return res.status(200).json({
        message: "Successful user deleted."
      });
    } else {
      throw new Error("No access rights.");
    }
  } catch (err) {
    next(err);
  }
};