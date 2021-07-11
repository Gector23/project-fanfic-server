const express = require("express");

const checkAuth = require("../middleware/checkAuth");

const fanficController = require("../controllers/fanfic");

const router = express.Router();

router.get("/", fanficController.getFanfics);
router.get("/search", fanficController.search);
router.post("/create", checkAuth, fanficController.create);
router.get("/:fanficId", fanficController.getFanfic);
router.get("/:fanficId/last-update", fanficController.getFanficUpdate);
router.get("/:fanficId/chapters", fanficController.getFanficChapters);
router.patch("/update/:fanficId", checkAuth, fanficController.update);
router.post("/:fanficId/rate", checkAuth, fanficController.rate);
router.get("/:fanficId/set-favorite", checkAuth, fanficController.setFavorite);
router.get("/:fanficId/remove-favorite", checkAuth, fanficController.removeFavorite);
router.delete("/:fanficId", checkAuth, fanficController.delete);

module.exports = router;