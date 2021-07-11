const Chapter = require("../models/chapter");

const fanficService = require("../services/fanficService");
const likeService = require("../services/likeService");

exports.create = async (req, res, next) => {
  try {
    const { _id: authId } = req.userData;
    const { name, content, fanfic } = req.body;
    const isOwner = await fanficService.isOwner(authId, fanfic);
    if (isOwner) {
      const chapterCount = await Chapter.find({ fanfic }).countDocuments();
      const chapter = await Chapter.create({
        fanfic,
        name,
        content,
        number: chapterCount + 1
      });
      await fanficService.fanficLastUpdateNow(fanfic);
      return res.status(200).json({
        message: "Chapter added.",
        chapter,
        isLiked: null
      });
    } else {
      throw new Error("No access rights.");
    }
  } catch (err) {
    next(err);
  }
};

exports.getChapter = async (req, res, next) => {
  try {
    const user = req.userData._id;
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found.");
    }
    let isLiked = false;
    if (user) {
      isLiked = await likeService.isLiked(user, chapterId);
    }
    return res.status(200).json({
      message: "Successful chapter query.",
      chapter,
      isLiked
    });
  } catch (err) {
    next(err);
  }
};

exports.getChapterUpdate = async (req, res, next) => {
  try {
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId, "lastUpdate");
    if (!chapter) {
      throw new Error("Chapter not found.");
    }
    return res.status(200).json({
      message: "Successful chapter last update query.",
      lastUpdate: chapter.lastUpdate
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { _id: authId, isAdmin } = req.userData;
    const chapterId = req.params.chapterId;
    const { name, content } = req.body;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found.");
    }
    const isOwner = await fanficService.isOwner(authId, chapter.fanfic);
    if (isAdmin || isOwner) {
      if (name) {
        chapter.name = name;
      }
      if (content) {
        chapter.content = content;
      }
      chapter.lastUpdate = Date.now();
      await chapter.save();
      await fanficService.fanficLastUpdateNow(chapter.fanfic);
      return res.status(200).json({
        message: "Successful chapter update."
      });
    } else {
      throw new Error("No access rights.");
    }

  } catch (err) {
    next(err);
  }
};

exports.move = async (req, res, next) => {
  try {
    const { _id: authId, isAdmin } = req.userData;
    const chapterId = req.params.chapterId;
    const { number } = req.body;
    const movingChapter = await Chapter.findById(chapterId);
    if (!movingChapter) {
      throw new Error("Chapter not found.");
    }
    const isOwner = await fanficService.isOwner(authId, movingChapter.fanfic);
    if (isAdmin || isOwner) {
      const swapingChapter = await Chapter.findOne({ fanfic: movingChapter.fanfic, number });
      if (!swapingChapter) {
        throw new Error("Chapter not found.");
      }
      swapingChapter.number = movingChapter.number;
      swapingChapter.lastUpdate = Date.now();
      await swapingChapter.save();
      movingChapter.number = number;
      movingChapter.lastUpdate = Date.now();
      await movingChapter.save();
      await fanficService.fanficLastUpdateNow(movingChapter.fanfic);
      return res.status(200).json({
        message: "Successful chapter move."
      });
    } else {
      throw new Error("No access rights.");
    }

  } catch (err) {
    next(err);
  }
};

exports.like = async (req, res, next) => {
  try {
    const user = req.userData._id;
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId, "likesCount");
    if (!chapter) {
      throw new Error("Chapter not found.");
    }
    const isLiked = await likeService.isLiked(user, chapterId);
    if (isLiked) {
      throw new Error("Already liked.");
    }
    await likeService.setLike(user, chapterId);
    chapter.likesCount++;
    await chapter.save();
    return res.status(200).json({
      message: "Like!"
    });
  } catch (err) {
    next(err);
  }
};

exports.unlike = async (req, res, next) => {
  try {
    const user = req.userData._id;
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId, "likesCount");
    if (!chapter) {
      throw new Error("Chapter not found.");
    }
    const isLiked = await likeService.isLiked(user, chapterId);
    if (!isLiked) {
      throw new Error("Not liked.");
    }
    await likeService.removeLike(user, chapterId);
    chapter.likesCount--;
    await chapter.save();
    return res.status(200).json({
      message: "Unlike!"
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { _id: authId, isAdmin } = req.userData;
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      throw new Error("Fanfic not found.");
    }
    const isOwner = await fanficService.isOwner(authId, chapter.fanfic);
    if (isAdmin || isOwner) {
      await Chapter.findByIdAndDelete(chapterId);
      await likeService.removeChapterLikes(chapterId);
      await fanficService.fanficLastUpdateNow(chapter.fanfic);
      return res.status(200).json({
        message: "Successful chapter delete."
      });
    } else {
      throw new Error("No access rights.");
    }
  } catch (err) {
    next(err);
  }
};