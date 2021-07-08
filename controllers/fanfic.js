const Fanfic = require("../models/fanfic");
const Chapter = require("../models/chapter");
const Tag = require("../models/tag");

const userService = require("../services/userService");
const rateService = require("../services/rateService");
const favoriteService = require("../services/favorite");

exports.create = async (req, res, next) => {
  try {
    const user = req.userData._id;
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
      fanfic,
      userRate: null
    });
  } catch (err) {
    next(err);
  }
};

exports.getFanfic = async (req, res, next) => {
  try {
    const user = req.userData._id;
    const fanficId = req.params.fanficId;
    const fanfic = await Fanfic.findById(fanficId)
      .populate({ path: "user", select: "_id login" })
      .populate({ path: "fandom", select: "_id name" })
      .populate({ path: "tags", select: "_id value" });
    if (!fanfic) {
      throw new Error("Fanfic not found.");
    }
    const fanficRelation = await userService.fanficRelation(user, fanfic);
    return res.status(200).json({
      message: "Successful fanfic query.",
      fanfic: fanficRelation
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

exports.getFanficChapters = async (req, res, next) => {
  try {
    const fanficId = req.params.fanficId;
    const chapters = await Chapter.find({ fanfic: fanficId }, "_id name")
      .sort({ number: 1 });
    return res.status(200).json({
      message: "Successful fanfic chapters query.",
      chapters
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

exports.rate = async (req, res, next) => {
  try {
    const user = req.userData._id;
    const fanficId = req.params.fanficId;
    const { value } = req.body;
    const fanfic = await Fanfic.findById(fanficId, "rating ratesCount");
    if (!fanfic) {
      throw new Error("Fanfic not found.");
    }
    const rate = await rateService.getRate(user, fanficId);
    await rateService.setRate(user, fanficId, value, rate?._id);
    if (rate) {
      fanfic.rating = ((fanfic.rating * fanfic.ratesCount - rate.value + value) / fanfic.ratesCount).toFixed(1);
    } else {
      fanfic.rating = ((fanfic.rating * fanfic.ratesCount + value) / (fanfic.ratesCount + 1)).toFixed(1);
      fanfic.ratesCount++;
    }
    await fanfic.save();
    return res.status(200).json({
      message: "Rate!"
    });
  } catch (err) {
    next(err);
  }
};

exports.setFavorite = async (req, res, next) => {
  try {
    const user = req.userData._id;
    const fanficId = req.params.fanficId;
    const isFavorite = await favoriteService.isFavorited(user, fanficId);
    if (isFavorite) {
      throw new Error("Already added to favorites.");
    }
    await favoriteService.setFavorite(user, fanficId);
    return res.status(200).json({
      message: "Fanfic added to favorites."
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const user = req.userData._id;
    const fanficId = req.params.fanficId;
    const isFavorite = await favoriteService.isFavorited(user, fanficId);
    if (!isFavorite) {
      throw new Error("Not added to favorites.");
    }
    await favoriteService.removeFavorite(user, fanficId);
    return res.status(200).json({
      message: "Fanfic removed from favorites."
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