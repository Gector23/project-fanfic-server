const Fanfic = require("../models/fanfic");
const Chapter = require("../models/chapter");

exports.create = async (req, res, next) => {
  try {
    const { name, content, fanfic } = req.body;
    const chapterCount = await Chapter.estimatedDocumentCount({ fanfic });
    const chapter = await Chapter.create({
      fanfic,
      name,
      content,
      number: chapterCount + 1
    });
    await Fanfic.findByIdAndUpdate(chapter.fanfic, { lastUpdate: Date.now() });
    return res.status(200).json({
      message: "Chapter added.",
      chapter
    });
  } catch (err) {
    next(err);
  }
};

exports.getChapter = async (req, res, next) => {
  try {
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found.");
    }
    return res.status(200).json({
      message: "Successful chapter query.",
      chapter
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
    const chapterId = req.params.chapterId;
    const { name, content } = req.body;
    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
      throw new Error("Chapter not found.");
    }
    if (name) {
      chapter.name = name;
    }
    if (content) {
      chapter.content = content;
    }
    chapter.lastUpdate = Date.now();
    await chapter.save();
    await Fanfic.findByIdAndUpdate(chapter.fanfic, { lastUpdate: Date.now() });
    return res.status(200).json({
      message: "Successful chapter update."
    });
  } catch (err) {
    next(err);
  }
};

exports.move = async (req, res, next) => {
  try {
    const chapterId = req.params.chapterId;
    const { number } = req.body;
    const movingChapter = await Chapter.findById(chapterId);
    if (!movingChapter) {
      throw new Error("Chapter not found.");
    }
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
    await Fanfic.findByIdAndUpdate(movingChapter.fanfic, { lastUpdate: Date.now() });
    return res.status(200).json({
      message: "Successful chapter move."
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const chapterId = req.params.chapterId;
    const chapter = await Chapter.findByIdAndDelete(chapterId);
    if (!chapter) {
      throw new Error("Fanfic not found.");
    }
    await Fanfic.findByIdAndUpdate(chapter.fanfic, { lastUpdate: Date.now() });
    return res.status(200).json({
      message: "Successful chapter delete."
    });
  } catch (err) {
    next(err);
  }
};