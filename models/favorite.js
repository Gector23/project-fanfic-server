const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fanfic: { type: mongoose.Schema.Types.ObjectId, ref: "Fanfic", required: true }
});

module.exports = mongoose.model("Favorite", favoriteSchema);