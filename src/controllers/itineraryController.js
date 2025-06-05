const ItineraryService = require('../services/itineraryService');

exports.createItinerary = async (req, res, next) => {
  try {
    const newItinerary = await ItineraryService.createItinerary(req.body);
    res.status(201).json(newItinerary);
  } catch (error) {
    next(error);
  }
};
