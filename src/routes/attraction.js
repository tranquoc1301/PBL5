const express = require("express");
const router = express.Router();
const attractionController = require("../controllers/attractionController");

//Search attractions by name
router.get("/search", attractionController.searchAttractions);

// Get all attractions
router.get("/", attractionController.getAllAttractions);

router.get("/special/:city_id", attractionController.getSpecialAttractionsByCity);

// Get attraction by ID
router.get("/:attractionId", attractionController.getAttractionById);

// Create new attraction
router.post("/", attractionController.createAttraction);

// Update attraction
router.put("/:attractionId", attractionController.updateAttraction);

// Delete attraction
router.delete("/:attractionId", attractionController.deleteAttraction);

module.exports = router;
