const express = require("express");

const authData = require("../middleware/authData");
const checkAuth = require("../middleware/checkAuth");

const chapterController = require("../controllers/chapter");

const router = express.Router();

router.post("/create", authData, checkAuth, chapterController.create);
router.get("/:chapterId", authData, chapterController.getChapter);
router.get("/last-update/:chapterId", chapterController.getChapterUpdate);
router.patch("/update/:chapterId", authData, checkAuth, chapterController.update);
router.patch("/move/:chapterId", authData, checkAuth, chapterController.move);
router.get("/:chapterId/like", authData, checkAuth, chapterController.like);
router.get("/:chapterId/unlike", authData, checkAuth, chapterController.unlike);
router.delete("/:chapterId", authData, checkAuth, chapterController.delete);

module.exports = router;