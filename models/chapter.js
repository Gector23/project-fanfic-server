const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema({
  fanfic: { type: mongoose.Schema.Types.ObjectId, ref: "Fanfic", required: true },
  name: { type: String, required: true, maxLength: 80 },
  content: { type: String },
  imageUrl: { type: String },
  cloudinaryPublicId: { type: String },
  number: { type: Number, required: true },
  lastUpdate: { type: Date, default: Date.now },
  likesCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Chapter", chapterSchema);