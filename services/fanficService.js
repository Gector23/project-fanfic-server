const Fanfic = require("../models/fanfic");

const chapterService = require("../services/chapterService");
const favoriteService = require("./favoriteService");
const rateService = require("../services/rateService");

exports.fanficLastUpdateNow = async fanficId => {
  try {
    return await Fanfic.findByIdAndUpdate(fanficId, { lastUpdate: Date.now() });
  } catch (err) {
    return err;
  }
};

exports.isOwner = async (userId, fanficId) => {
  try {
    const fanfic = await Fanfic.findById(fanficId, "user");
    return userId === fanfic.user.toString();
  } catch (err) {
    return err;
  }
};

exports.removeFanficData = async fanficId => {
  try {
    await chapterService.removeFanficChapters(fanficId);
    await favoriteService.removeFanficFavorites(fanficId);
    await rateService.removeFanficRates(fanficId);
  } catch (err) {
    return err;
  }
};

exports.removeUserFanfics = async user => {
  try {
    const fanfics = await Fanfic.find({ user }, "_id");
    await Fanfic.deleteMany({ user });
    for (let fanfic of fanfics) {
      await chapterService.removeFanficChapters(fanfic._id);
      await favoriteService.removeFanficFavorites(fanfic._id);
      await rateService.removeFanficRates(fanfic._id);
    }
  } catch (err) {
    return err;
  }
};