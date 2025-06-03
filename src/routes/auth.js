const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Đăng ký người dùng
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Đăng nhập bằng Google
router.get("/google", authController.googleAuth);

// Callback từ Google
router.get("/google/callback", authController.googleAuthCallback);

// Trả về token sau khi login thành công
router.get("/auth-success", authController.authSuccess);

// Gửi email reset password
router.post("/forgot-password", authController.forgotPassword);

// Reset mật khẩu
router.post("/reset-password/:token", authController.resetPassword);

// Đăng xuất
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
