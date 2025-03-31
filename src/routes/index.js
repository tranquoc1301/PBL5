const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const activityRoutes = require("./activity");
const commentRoutes = require("./comment");
const attractionRoutes = require("./attraction");


const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/activity", activityRoutes);

router.use("/comment", commentRoutes);

router.use("/attractions", attractionRoutes);

module.exports = router;
