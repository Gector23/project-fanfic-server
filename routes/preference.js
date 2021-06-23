const express = require("express");

const checkAuth = require("../middleware/check-auth");

const preferenceController = require("../controllers/preference");

const router = express.Router();

router.put("/set", checkAuth, preferenceController.setPreferences);
router.get("", checkAuth, preferenceController.getPreferences);

module.exports = router;