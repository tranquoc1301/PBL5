const express = require('express');
const router = express.Router();
const itineraryController = require('../controllers/itineraryController');

// POST /itineraries
router.post('/', itineraryController.createItinerary);

module.exports = router;
