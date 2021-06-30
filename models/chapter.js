const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema({
  fanfic: { type: mongoose.Schema.Types.ObjectId, ref: "Fanfic", required: true },
  name: { type: String, required: true, maxLength: 80 },
  content: { type: String },
  number: { type: Number, required: true },
  lastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chapter", chapterSchema);