const Favorite = require("../models/favorite");

exports.setFavorite = async (user, fanfic) => {
  try {
    return await Favorite.create({ user, fanfic });
  } catch (err) {
    return err;
  }
};

exports.removeFavorite = async (user, fanfic) => {
  try {
    return await Favorite.findOneAndDelete({ user, fanfic });
  } catch (err) {
    return err;
  }
};

exports.isFavorited = async (user, fanfic) => {
  try {
    const favorite = await Favorite.findOne({ user, fanfic });
    return favorite ? true : false;
  } catch (err) {
    return err;
  }
};