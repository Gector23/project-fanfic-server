const express = require("express");

const fandomController = require("../controllers/fandom");

const router = express.Router();

router.get("", fandomController.getFandoms);

module.exports = router;