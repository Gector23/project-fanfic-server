const Fanfic = require("../models/fanfic");
const Chapter = require("../models/chapter");
const Tag = require("../models/tag");

exports.create = async (req, res, next) => {
  try {
    const user = req.userData.id;
    const { name, fandom, description, tags } = req.body;
    let fanficTags = [];
    for (tag of tags) {
      if (tag._id) {
        fanficTags.push(tag._id);
      } else {
        const newTag = await Tag.create({ value: tag.value });
        fanficTags.push(newTag._id);
      }
    }
    const fanfic = await Fanfic.create({
      user,
      name,
      fandom,
      description,
      tags: fanficTags
    });
    return res.status(200).json({
      message: "Successful creation of fanfic.",
      fanfic
    });
  } catch (err) {
    next(err);
  }
};

exports.getFanfic = async (req, res, next) => {
  try {
    const fanficId = req.params.fanficId;
    const fanfic = await Fanfic.findById(fanficId)
      .populate({ path: "user", select: "_id login" })
      .populate({ path: "fandom", select: "_id name" })
      .populate({ path: "tags", select: "_id value" });
    if (!fanfic) {
      throw new Error("Fanfic not found.");
    }
    const chapters = await Chapter.find({ fanfic: fanfic._id }, "_id name")
      .sort({ number: 1 });
    fanfic.chapters = chapters;
    return res.status(200).json({
      message: "Successful fanfic query.",
      fanfic,
      chapters
    });
  } catch (err) {
    next(err);
  }
};

exports.getFanficUpdate = async (req, res, next) => {
  try {
    const fanficId = req.params.fanficId;
    const fanfic = await Fanfic.findById(fanficId, "lastUpdate");
    if (!fanfic) {
      throw new Error("Fanfic not found.");
    }
    return res.status(200).json({
      message: "Successful fanfic last update query.",
      lastUpdate: fanfic.lastUpdate
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const fanficId = req.params.fanficId;
    const { name, fandom, description, tags } = req.body;
    const fanfic = await Fanfic.findById(fanficId);
    if (!fanfic) {
      throw new Error("Fanfic not found.");
    }
    if (name) {
      fanfic.name = name;
    }
    if (fandom) {
      fanfic.fandom = fandom;
    }
    if (description) {
      fanfic.description = description;
    }
    if (tags) {
      let fanficTags = [];
      for (const tag of tags) {
        if (tag._id) {
          fanficTags.push(tag._id);
        } else {
          const newTag = await Tag.create({ value: tag.value });
          fanficTags.push(newTag._id);
        }
      }
      fanfic.tags = fanficTags;
    }
    fanfic.lastUpdate = Date.now();
    await fanfic.save();
    return res.status(200).json({
      message: "Successful fanfic update."
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const fanficId = req.params.fanficId;
    const fanfic = await Fanfic.findByIdAndDelete(fanficId);
    if (!fanfic) {
      throw new Error("Fanfic not found.");
    }
    await Chapter.deleteMany({ fanfic: fanfic._id });
    return res.status(200).json({
      message: "Successful fanfic delete."
    });
  } catch (err) {
    next(err);
  }
};