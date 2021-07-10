const User = require("../models/user");

const rateService = require("./rateService");
const favoriteService = require("./favorite");

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