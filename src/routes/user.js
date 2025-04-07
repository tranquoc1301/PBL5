// routes/user.js
const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const auth = require("../middleware/authMiddleware").verifyToken;
const isAdmin = require("../middleware/authMiddleware").isAdmin;
const isUser = require("../middleware/authMiddleware").isUser;

// Get all users
router.get("/", userController.getAllUsers);

//Search user
router.get("/search", userController.searchUsers);

// Get user by id
router.get("/:id", userController.getUserById);

// Get user by email
router.get("/", userController.getUserByEmail);

// Create new user
router.post("/", userController.createUser);

// Update user by id
router.put("/:id", userController.updateUser);

// Delete user by id
router.delete("/:id", userController.deleteUser);

module.exports = router;
