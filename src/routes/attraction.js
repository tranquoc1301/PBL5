const express = require("express");
const router = express.Router();
const AttractionController = require("../controllers/attractionController");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// // Get all attractions
router.get("/", attractionController.getAllAttractions);
router.get(
  "/name/:name/cityid/:city_id",
  attractionController.getAttractionByName
);
// Search attractions by name
router.get("/search", AttractionController.searchAttractions);

// Get all attractions
router.get("/", AttractionController.getAllAttractions);

// Get special attractions by city ID
router.get(
  "/special/:city_id",
  AttractionController.getSpecialAttractionsByCity
);

router.get("/city/:city_id", attractionController.getAttractionByCity);
router.get("/rank/:attractionId", attractionController.getAttractionRank);
router.get(
  "/:attractionId/topnearby",
  AttractionController.getNearbyTopAttractions
);

// Get attractions by tags
router.get("/tags", AttractionController.getAttractionsByTags);

// Get attraction by ID
router.get("/:attractionId", AttractionController.getAttractionById);

// Upload images for attractions
router.post(
  "/upload",
  upload.array("images", 10),
  AttractionController.uploadImages
);

// Create new attraction
router.post("/", AttractionController.createAttraction);

// Update attraction
router.put("/:attractionId", AttractionController.updateAttraction);

// Delete attraction
router.delete("/:attractionId", AttractionController.deleteAttraction);

module.exports = router;
