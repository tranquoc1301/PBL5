const itinerary = require('../models/itinerary');
const ItineraryService = require('../services/itineraryService');

exports.createItinerary = async (req, res, next) => {
  try {
    const newItinerary = await ItineraryService.createItinerary(req.body);
    res.status(201).json(newItinerary);
  } catch (error) {
    next(error);
  }
};

exports.getItineraryByID = async (req, res, next) => {
  try {
    const { itinerary_id } = req.params;
    const newItinerary = await ItineraryService.getItinerarybyId(itinerary_id);
    res.status(200).json(newItinerary);
  } catch (err) {
    next(err);
  }
}

exports.getFinishedItinerarybyUser = async (req, res, next) => {
  try {
    const {user_id} = req.params;
    const itinerary = await ItineraryService.getFinishedItinerarybyUser(user_id);
    res.status(200).json(itinerary);
  } catch (err) {
    next(err);
  }
}


exports.getNotFinishedItinerarybyUser = async (req, res, next) => {
  try {
    const {user_id} = req.params;
    const itinerary = await ItineraryService.getNotFinishedItinerarybyUser(user_id);
    res.status(200).json(itinerary);
  } catch (err) {
    next(err);
  }
}
