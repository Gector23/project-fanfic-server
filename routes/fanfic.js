const express = require("express");

const authData = require("../middleware/authData");
const checkAuth = require("../middleware/checkAuth");

const fanficController = require("../controllers/fanfic");

const router = express.Router();

router.post("/create", authData, checkAuth, fanficController.create);
router.get("/:fanficId", authData, fanficController.getFanfic);
router.get("/last-update/:fanficId", fanficController.getFanficUpdate);
router.patch("/update/:fanficId", authData, checkAuth, fanficController.update);
router.post("/:fanficId/rate", authData, checkAuth, fanficController.rate);
router.delete("/:fanficId", authData, checkAuth, fanficController.delete);

module.exports = router;