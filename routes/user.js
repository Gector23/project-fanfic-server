const express = require("express");

const checkAuth = require("../middleware/checkAuth");

const userController = require("../controllers/user");

const router = express.Router();

router.get("/:userId", userController.getUser);
router.get("/:userId/last-update", userController.getUserUpdate);
router.put("/:userId/preferences", checkAuth, userController.setPreferences);
router.get("/:userId/fanfics", userController.getUserFanfics);
router.get("/:userId/favorites", userController.getUserFavorites);

module.exports = router;