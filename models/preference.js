const mongoose = require("mongoose");

const preferenceSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fandoms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fandom" }]
});

module.exports = mongoose.model("Preference", preferenceSchema);