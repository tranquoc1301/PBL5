const express = require("express");
const authRoutes = require("./auth");
const userRoutes = require("./user");
// const activityRoutes = require("./activity");
const reviewRoutes = require("./review");
const attractionRoutes = require("./attraction");
const ggmapRoutes = require("./ggmap");
const restaurantRoutes = require("./restaurant.js");
const cityRoutes = require("./city.js");
const tagRoutes = require("./tags.js");
const recentlyViewedRoutes = require("./recentlyViewed.js");
const favoriteRoutes = require("./favorite.js");
const itinerary = require("./itinerary.js");
const itineraryDetail = require("./itineraryDetail.js");

const router = express.Router();

router.use("/auth", authRoutes);

router.use("/users", userRoutes);
router.use("/reviews", reviewRoutes);
router.use("/attractions", attractionRoutes);
// router.use("/ggmap", ggmapRoutes);
router.use("/restaurants", restaurantRoutes);
router.use("/cities", cityRoutes);
router.use("/api/tags", tagRoutes);
router.use("/recently-viewed", recentlyViewedRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/itinerary", itinerary);
router.use("/itineraryDetail", itineraryDetail);
// router.use("/restaurant", restaurantRoutes);
module.exports = router;
