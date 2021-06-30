const mongoose = require("mongoose");
const Tag = require("./tag");

const fanficSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, maxLength: 80 },
  fandom: { type: mongoose.Schema.Types.ObjectId, ref: "Fandom", required: true },
  description: { type: String, required: true, maxLength: 300 },
  lastUpdate: { type: Date, default: Date.now },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: Tag, default: [] }]
});

module.exports = mongoose.model("Fanfic", fanficSchema);