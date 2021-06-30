const express = require("express");

const checkAuth = require("../middleware/check-auth");

const fanficController = require("../controllers/fanfic");

const router = express.Router();

router.post("/create", checkAuth, fanficController.create);
router.get("/:fanficId", fanficController.getFanfic);
router.get("/last-update/:fanficId", fanficController.getFanficUpdate);
router.patch("/update/:fanficId", checkAuth, fanficController.update);
router.delete("/:fanficId", checkAuth, fanficController.delete);

module.exports = router;