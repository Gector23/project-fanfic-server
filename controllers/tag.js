const Tag = require("../models/tag");

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({});
    return res.status(200).json({
      message: "Successful get tags.",
      tags
    });
  } catch (err) {
    next(err);
  }
};