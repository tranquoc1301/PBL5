const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// POST /itineraries
router.post('/', itineraryController.createItinerary);
router.get('/finished/:user_id', itineraryController.getNotFinishedItinerarybyUser);
router.get('/notfinished/:user_id', itineraryController.getFinishedItinerarybyUser);
module.exports = router;
