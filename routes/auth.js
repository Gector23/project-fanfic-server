const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.get("/signout", authController.signout);
router.get("/activate/:link", authController.activate);
router.get("/refresh", authController.refresh);

module.exports = router;