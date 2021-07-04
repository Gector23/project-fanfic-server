const mongoose = require("mongoose");

const rateSchema = mongoose.Schema({
  fanfic: { type: mongoose.Schema.Types.ObjectId, ref: "Fanfic", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  value: { type: Number, required: true, min: 1, max: 5 }
});

module.exports = mongoose.model("Rate", rateSchema);