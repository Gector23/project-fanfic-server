const User = require("../models/user");

const rateService = require("./rateService");

exports.userLastUpdateNow = async user => {
  try {
    return await User.findByIdAndUpdate(user, { lastUpdate: Date.now() });
  } catch (err) {
    return err;
  }
};

exports.fanficRelation = async (user, fanfic) => {
  try {
    let userRate = null;
    if (user) {
      const rate = await rateService.getRate(user, fanfic._id);
      userRate = rate ? rate.value : null;
    }
    return {
      data: fanfic,
      userRate
    };
  } catch (err) {
    return err;
  }
};