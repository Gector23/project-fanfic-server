const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
  value: {type: String, required: true, unique: true}
});

module.exports = mongoose.model("Tag", tagSchema);