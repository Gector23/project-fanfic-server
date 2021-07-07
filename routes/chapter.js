const express = require("express");

const checkAuth = require("../middleware/checkAuth");

const chapterController = require("../controllers/chapter");

const router = express.Router();

router.post("/create", checkAuth, chapterController.create);
router.get("/:chapterId", chapterController.getChapter);
router.get("/:chapterId/last-update", chapterController.getChapterUpdate);
router.patch("/update/:chapterId", checkAuth, chapterController.update);
router.patch("/move/:chapterId", checkAuth, chapterController.move);
router.get("/:chapterId/like", checkAuth, chapterController.like);
router.get("/:chapterId/unlike", checkAuth, chapterController.unlike);
router.delete("/:chapterId", checkAuth, chapterController.delete);

module.exports = router;