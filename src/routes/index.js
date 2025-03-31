const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const activityRoutes = require("./activity");
const commentRoutes = require("./comment");
const reviewRoutes = require("./review");
const articleRoutes = require("./article");
const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);
router.use("/review", reviewRoutes);
router.use("/activity", activityRoutes);

router.use("/comment", commentRoutes);
router.use("/article", articleRoutes);

module.exports = router;
