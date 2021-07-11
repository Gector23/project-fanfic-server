module.exports = (req, res, next) => {
  try {
    if (!req.userData.isAdmin) {
      throw new Error("No access rights.");
    }
    next();
  } catch (err) {
    next(err);
  }
};