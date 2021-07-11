const Like = require("../models/like");

exports.setLike = async (user, chapter) => {
  try {
    return await Like.create({ user, chapter });
  } catch (err) {
    return err;
  }
};

exports.removeLike = async (user, chapter) => {
  try {
    return await Like.findOneAndDelete({ user, chapter });
  } catch (err) {
    return err;
  }
};

exports.isLiked = async (user, chapter) => {
  try {
    const like = await Like.findOne({ user, chapter });
    return like ? true : false;
  } catch (err) {
    return err;
  }
};

exports.removeUserLikes = async user => {
  try {
    return await Like.deleteMany({ user });
  } catch (err) {
    return err;
  }
};

exports.removeChapterLikes = async chapter => {
  try {
    return await Like.deleteMany({ chapter });
  } catch (err) {
    return err;
  }
};