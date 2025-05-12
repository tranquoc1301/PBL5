const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
// const activityRoutes = require("./activity");
const commentRoutes = require("./comment");
const reviewRoutes = require("./review");
const attractionRoutes = require("./attraction");
const articleRoutes = require("./article");
const ggmapRoutes = require("./ggmap");
const restaurantRoutes = require("./restaurant.js");
const cityRoutes = require("./city.js");
const tagRoutes = require("./tags.js");
const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);
router.use("/reviews", reviewRoutes);
// router.use("/activity", activityRoutes);
router.use("/attractions", attractionRoutes);
router.use("/comment", commentRoutes);
router.use("/articles", articleRoutes);
router.use("/ggmap", ggmapRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/cities", cityRoutes);
router.use("/api/tags", tagRoutes);

// router.use("/restaurant", restaurantRoutes);
module.exports = router;
