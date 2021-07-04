const express = require("express");

const authData = require("../middleware/authData");
const checkAuth = require("../middleware/checkAuth");

const preferenceController = require("../controllers/preference");

const router = express.Router();

router.put("/set", authData, checkAuth, preferenceController.setPreferences);
router.get("", authData, checkAuth, preferenceController.getPreferences);

module.exports = router;