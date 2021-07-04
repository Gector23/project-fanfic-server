const Rate = require("../models/rate");

exports.setRate = async (user, fanfic, value, rateId) => {
  try {
    if (rateId) {
      return await Rate.findByIdAndUpdate(rateId, { value });
    } else {
      return await Rate.create({ user, fanfic, value });
    }
  } catch (err) {
    return err;
  }
};

exports.getRate = async (user, fanfic) => {
  try {
    return await Rate.findOne({ user, fanfic });
  } catch (err) {
    return err;
  }
};