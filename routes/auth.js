const express = require("express");
const bcrypt = require("bcrypt");
const uuid = require("uuid");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const { email, login, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new Error(`User with email ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid.v4();
    const user = await User.create({
      email,
      login,
      password: hashPassword,
      activationLink
    });
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});
router.post("/signin", async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
  }
});
router.post("/signout", async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
  }
});
router.get("/activate/:link", async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
  }
});
router.get("/refresh", async (req, res, next) => {
  try {

  } catch (err) {
    console.log(err);
  }
});

module.exports = router;