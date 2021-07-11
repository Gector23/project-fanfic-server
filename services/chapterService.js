const Chapter = require("../models/chapter");

const likeService = require("../services/likeService");

exports.removeFanficChapters = async fanfic => {
  try {
    const chapters = await Chapter.find({ fanfic }, "_id");
    await Chapter.deleteMany({ fanfic });
    for (let chapter of chapters) {
      await likeService.removeChapterLikes(chapter._id);
    }
  } catch (err) {
    return err;
  }
};