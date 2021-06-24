const mongoose = require("mongoose");

const fandomSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true }
});

module.exports = mongoose.model("Fandom", fandomSchema);