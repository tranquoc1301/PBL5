const express = require('express');
const router = express.Router();
const itineraryDetailsController = require('../controllers/itineraryDetailsController.js');

router.get("/:userId/:itineraryId", itineraryDetailsController.getDetailsByUserAndItinerary);
router.post("/", itineraryDetailsController.createItineraryDetail);
router.delete("/delete/:itinerary_id", itineraryDetailsController.deleteItineraryDetailsByItineraryId);
module.exports = router;