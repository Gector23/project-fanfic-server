const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {type: String, unique: true, required: true},
  login: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  isActivated: {type: Boolean, default: false},
  isInitializedPreferences: {type: Boolean, default: false},
  preferences : [{ type: mongoose.Schema.Types.ObjectId, ref: "Fandom", default: [] }],
  isAdmin: {type: Boolean, default: false},
  isBlocked: {type: Boolean, default: false},
  signUp: {type: Date, default: Date.now},
  lastSignIn: {type: Date, default: Date.now},
  lastUpdate: { type: Date, default: Date.now },
  activationLink: {type: String}
});

module.exports = mongoose.model("User", userSchema);