// src/routes/user.js
const express = require("express");
const multer = require("multer");
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware").verifyToken;
const isAdmin = require("../middleware/authMiddleware").isAdmin;
const isUser = require("../middleware/authMiddleware").isUser;

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", auth, isAdmin, userController.getAllUsers);

// Search users
router.get("/search", auth, userController.searchUsers);

// Get user by ID
router.get("/:id", userController.getUserById);

// Get user by email
router.get("/email/:email", userController.getUserByEmail);

// Create new user (no auth required for registration)
router.post("/", auth, isAdmin, userController.createUser);

// Update user by ID (user or admin)
router.put("/:id", upload.single("avatar"), userController.updateUser);

// Upload avatar
router.post(
  "/upload-avatar",

  upload.single("avatar"),
  userController.uploadAvatar
);
router.post(
  "/upload-cover",
  upload.single("cover"),
  userController.uploadCover
);
// Delete user by ID (admin only)
router.delete("/:id", auth, isAdmin, userController.deleteUser);

module.exports = router;
