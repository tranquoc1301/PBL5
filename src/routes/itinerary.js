const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// POST /itineraries
router.post('/', itineraryController.createItinerary);
router.get('/id/:itinerary_id', itineraryController.getItineraryByID);
router.get('/finished/:user_id', itineraryController.getFinishedItinerarybyUser);
router.get('/notfinished/:user_id', itineraryController.getNotFinishedItinerarybyUser);
router.put('/update/:itinerary_id', itineraryController.updateItinerary);
module.exports = router;
