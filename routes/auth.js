const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.get("/sign-out", authController.signOut);
router.get("/activate", authController.activate);
router.get("/refresh", authController.refresh);

module.exports = router;