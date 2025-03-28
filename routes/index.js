const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
const activityRoutes = require("./activity");
const locationRoutes = require("./location");
const commentRoutes = require("./comment");


const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);

router.use("/activity", activityRoutes);
router.use("/location", locationRoutes);
router.use("/comment", commentRoutes);
module.exports = router;
