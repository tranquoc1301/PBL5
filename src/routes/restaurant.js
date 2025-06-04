const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const multer = require("multer");

// Configure multer to store files in memory (for Cloudinary upload)
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.get(
  "/special/:city_id",
  restaurantController.getSpecialRestaurantByCity
);
router.get(
  "/topnearby/:restaurantId",
  restaurantController.getNearbyTopRestaurant
);
router.get("/rank/:restaurantId", restaurantController.getRestaurantRank);
router.post(
  "/upload",
  upload.array("images", 10), // Limit to 10 images
  restaurantController.uploadImages
);
router.post("/", restaurantController.createRestaurant);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
