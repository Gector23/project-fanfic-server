const express = require("express");

const checkAuth = require("../middleware/check-auth");

const chapterController = require("../controllers/chapter");

const router = express.Router();

router.post("/create", checkAuth, chapterController.create);
router.get("/:chapterId", chapterController.getChapter);
router.get("/last-update/:chapterId", chapterController.getChapterUpdate);
router.patch("/update/:chapterId", checkAuth, chapterController.update);
router.patch("/move/:chapterId", checkAuth, chapterController.move);
router.delete("/:chapterId", checkAuth, chapterController.delete);

module.exports = router;