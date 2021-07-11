const User = require("../models/user");

const favoriteService = require("./favoriteService");
const tokenService = require("../services/tokenService");
const fanficService = require("../services/fanficService");
const rateService = require("../services/rateService");
const likeService = require("../services/likeService");

exports.isAdmin = async userId => {
  try {
    const user =  await User.findById(userId, "isAdmin");
    return user.isAdmin;
  } catch (err) {
    return err;
  }
};

exports.userLastUpdateNow = async user => {
  try {
    return await User.findByIdAndUpdate(user, { lastUpdate: Date.now() });
  } catch (err) {
    return err;
  }
};

exports.fanficRelations = async (user, fanfic) => {
  try {
    let userRate = null;
    let isFavorited = false;
    if (user) {
      const rate = await rateService.getRate(user, fanfic._id);
      userRate = rate ? rate.value : null;
      isFavorited = await favoriteService.isFavorited(user, fanfic);
    }
    return {
      data: fanfic,
      userRate,
      isFavorited
    };
  } catch (err) {
    return err;
  }
};

exports.removeUserData = async userId => {
  try {
    await tokenService.removeUserToken(userId);
    await fanficService.removeUserFanfics(userId);
    await favoriteService.removeUserFavorites(userId);
    await rateService.removeUserRates(userId);
    await likeService.removeUserLikes(userId);
  } catch (err) {
    return err;
  }
};