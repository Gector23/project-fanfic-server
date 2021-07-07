const bcrypt = require("bcrypt");
const uuid = require("uuid");

const tokenService = require("../services/tokenService");
const mailService = require("../services/mailService");

const User = require("../models/user");

exports.signUp = async (req, res, next) => {
  try {
    const { email, login, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new Error("Email already exists.");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid.v4();
    const user = await User.create({
      email,
      login,
      password: hashPassword,
      activationLink
    });
    await mailService.sendActivationMail(email, activationLink);
    const tokens = tokenService.generateTokens({
      _id: user._id,
      email: user.email
    });
    await tokenService.saveRefreshToken(user._id, tokens.refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.status(201).json({
      message: "User created.",
      accessToken: tokens.accessToken,
      user: {
        _id: user._id,
        login: user.login,
        isActivated: user.isActivated,
        isInitializedPreferences: user.isInitializedPreferences,
        isAdmin: user.isAdmin,
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Incorrect email.");
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      throw new Error("Incorrect password.");
    }
    const tokens = tokenService.generateTokens({
      _id: user._id,
      email: user.email
    });
    await tokenService.saveRefreshToken(user._id, tokens.refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    user.lastSignIn = Date.now();
    await user.save();
    return res.status(200).json({
      message: "Successful sign in.",
      accessToken: tokens.accessToken,
      user: {
        _id: user._id,
        login: user.login,
        isActivated: user.isActivated,
        isInitializedPreferences: user.isInitializedPreferences,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.signOut = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await tokenService.removeRefreshToken(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json({
      message: "Successful sign out."
    });
  } catch (err) {
    next(err);
  }
};

exports.activate = async (req, res, next) => {
  try {
    const activationLink = req.query.activationLink;
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw new Error("Incorrect activation link.");
    }
    if (!user.isActivated) {
      user.isActivated = true;
      await user.save();
    };
    res.status(200).json({
      message: "Account activated."
    });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const tokenPayload = tokenService.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    const token = await tokenService.findRefreshToken(refreshToken);
    if (!tokenPayload || !token) {
      throw new Error("Auth failed.");
    }
    const user = await User.findById(tokenPayload._id);
    const tokens = tokenService.generateTokens({
      _id: user._id,
      email: user.email
    });
    await tokenService.saveRefreshToken(user._id, tokens.refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    return res.status(200).json({
      message: "Successful refresh.",
      accessToken: tokens.accessToken,
      user: {
        _id: user._id,
        login: user.login,
        isActivated: user.isActivated,
        isInitializedPreferences: user.isInitializedPreferences,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    next(err);
  }
};