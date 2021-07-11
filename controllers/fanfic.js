const Fanfic = require("../models/fanfic");
const Chapter = require("../models/chapter");
const Tag = require("../models/tag");

const fanficService = require("../services/fanficService");
const userService = require("../services/userService");
const rateService = require("../services/rateService");
const favoriteService = require("../services/favoriteService");

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
    userService.userLastUpdateNow(user);
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
    const fanficRelations = await userService.fanficRelations(user, fanfic);
    return res.status(200).json({
      message: "Successful fanfic query.",
      fanfic: fanficRelations
    });
  } catch (err) {
    next(err);
  }
};

exports.getFanfics = async (req, res, next) => {
  try {
    const { sortField, pageSize, currentPage, preferences } = req.query;
    let fanficsQuery;
    let maxFanfics;
    if (preferences) {
      maxFanfics = await Fanfic.find({ fandom: preferences }, "_id name").countDocuments();
      fanficsQuery = Fanfic.find({ fandom: preferences }, "_id name");
    } else {
      maxFanfics = await Fanfic.find({}, "_id name").countDocuments();
      fanficsQuery = Fanfic.find({}, "_id name");
    }
    if (sortField) {
      fanficsQuery.sort(`-${sortField}`);
    }
    if (pageSize && currentPage) {
      fanficsQuery.skip(pageSize * (currentPage - 1)).limit(+pageSize);
    }
    const fanfics = await fanficsQuery;
    return res.status(200).json({
      message: "Successful fanfics query.",
      data: fanfics,
      maxFanfics
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
    const { _id: authId, isAdmin } = req.userData;
    const fanficId = req.params.fanficId;
    const { name, fandom, description, tags } = req.body;
    const fanfic = await Fanfic.findById(fanficId);
    if (!fanfic) {
      throw new Error("Fanfic not found.");
    }
    if (isAdmin || fanfic.user.toString() === authId) {
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
    } else {
      throw new Error("No access rights.");
    }
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
    userService.userLastUpdateNow(user);
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
    userService.userLastUpdateNow(user);
    return res.status(200).json({
      message: "Fanfic removed from favorites."
    });
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { searchString, pageSize, currentPage } = req.query;
    const fanfics = await Fanfic.find({$text: {$search: searchString}}, "_id");
    let searchedFanfics = fanfics.map(fanfic => fanfic._id);
    const chapters = await Chapter.find({$text: {$search: searchString}, fanfic: {$nin: searchedFanfics}}, "fanfic");
    searchedFanfics.push(
      ...chapters.map(chapter => chapter.fanfic)
    );
    const fanficsQuery = Fanfic.find({_id: {$in: searchedFanfics}}, "_id name");
    if (pageSize && currentPage) {
      fanficsQuery.skip(pageSize * (currentPage - 1)).limit(+pageSize);
    }
    const data = await fanficsQuery;
    return res.status(200).json({
      message: "Successful search.",
      data,
      maxFanfics: searchedFanfics.length
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { _id: authId, isAdmin } = req.userData;
    const fanficId = req.params.fanficId;
    const isOwner = await fanficService.isOwner(authId, fanficId);
    if (isAdmin || isOwner) {
      const fanfic = await Fanfic.findByIdAndDelete(fanficId);
      if (!fanfic) {
        throw new Error("Fanfic not found.");
      }
      await fanficService.removeFanficData(fanficId);
      await userService.userLastUpdateNow(fanfic.user);
      return res.status(200).json({
        message: "Successful fanfic delete."
      });
    } else {
      throw new Error("No access rights.");
    }
  } catch (err) {
    next(err);
  }
};