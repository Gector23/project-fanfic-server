const Fandom = require("../models/fandom");

exports.getFandoms = async (req, res, next) => {
  try {
    const fandoms = await Fandom.find({});
    return res.status(200).json({
      message: "Successful get fandoms.",
      fandoms
    });
  } catch (err) {
    next(err);
  }
};