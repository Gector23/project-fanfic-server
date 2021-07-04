const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model("Like", likeSchema);