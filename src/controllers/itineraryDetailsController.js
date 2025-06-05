const ItineraryDetailService = require('../services/itineraryDetailsService.js');

exports.getDetailsByUserAndItinerary = async (req, res, next) => {
  const { userId, itineraryId } = req.params;
  try {
    const details = await ItineraryDetailService.getDetailsByUserAndItinerary(userId, itineraryId);
    res.status(200).json(details);
  } catch (error) {
    console.error("Error fetching itinerary details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.createItineraryDetail = async (req, res, next) => {
  try {
    const newItineraryDetail = await ItineraryDetailService.createItineraryDetail(req.body);
    res.status(201).json(newItineraryDetail);
  } catch (error) {
    next(error);
  }
};