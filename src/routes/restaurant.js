const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");

router.get("/", restaurantController.getAllRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.get(
  "/special/:city_id",
  restaurantController.getSpecialRestaurantByCity
);
router.get("/topnearby/:restaurantId", restaurantController.getNearbyTopRestaurant);
router.get("/rank/:restaurantId", restaurantController.getRestaurantRank);
router.post("/", restaurantController.createRestaurant);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);

module.exports = router;
