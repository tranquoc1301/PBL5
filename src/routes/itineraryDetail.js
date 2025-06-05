const express = require('express');
const router = express.Router();
const itineraryDetailsController = require('../controllers/itineraryDetailsController.js');

router.get("/:userId/:itineraryId", itineraryDetailsController.getDetailsByUserAndItinerary);

module.exports = router;