const express = require("express");
const router = express.Router();
const recentlyViewedController = require("../controllers/recentlyViewedController");

router.post("/", recentlyViewedController.createRecentlyViewed);
router.get("/", recentlyViewedController.getRecentlyViewed);

module.exports = router;
