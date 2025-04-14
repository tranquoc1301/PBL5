const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/google", authController.googleAuth);
// Callback từ Google
router.get("/google/callback", authController.googleAuthCallback);
// Trả về token sau khi login thành công
router.get("/success", authController.authSuccess);

// Gửi email reset password
router.post("/forgot-password", authController.forgotPassword);
// Reset mật khẩu
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
