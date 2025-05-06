const express = require("express");
const router = express.Router();
const attractionController = require("../controllers/attractionController");

//Search attractions by name
router.get("/search", attractionController.searchAttractions);

// // Get all attractions
router.get("/", attractionController.getAllAttractions);

router.get("/special/:city_id", attractionController.getSpecialAttractionsByCity);
router.get("/rank/:attractionId", attractionController.getAttractionRank);
router.get("/topnearby/:attractionId",attractionController.getNearbyTopAttractions);
// // Get attraction by ID
router.get("/tags", attractionController.getAttractionsByTags);
router.get("/:attractionId", attractionController.getAttractionById);

// // Create new attraction
router.post("/", attractionController.createAttraction);

// Update attraction
router.put("/:attractionId", attractionController.updateAttraction);

// Delete attraction
router.delete("/:attractionId", attractionController.deleteAttraction);

module.exports = router;
