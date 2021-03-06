module.exports = (req, res, next) => {
  try {
    if (!req.userData._id) {
      throw new Error("Auth failed.");
    }
    next();
  } catch (err) {
    next(err);
  }
};