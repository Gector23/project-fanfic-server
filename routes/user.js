const express = require("express");

const checkAuth = require("../middleware/checkAuth");
const checkAdmin = require("../middleware/checkAdmin");

const userController = require("../controllers/user");

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:userId", userController.getUser);
router.delete("/:userId", checkAuth, userController.delete);
router.get("/:userId/last-update", userController.getUserUpdate);
router.put("/:userId/preferences", checkAuth, userController.setPreferences);
router.get("/:userId/fanfics", userController.getUserFanfics);
router.get("/:userId/favorites", userController.getUserFavorites);
router.patch("/:userId/set-admin", checkAuth, checkAdmin, userController.setAdmin);
router.patch("/:userId/remove-admin", checkAuth, checkAdmin, userController.removeAdmin);
router.patch("/:userId/block", checkAuth, checkAdmin, userController.block);
router.patch("/:userId/unblock", checkAuth, checkAdmin, userController.unblock);

module.exports = router;