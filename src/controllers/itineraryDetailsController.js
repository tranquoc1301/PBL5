const ItineraryDetailService = require('../services/itineraryDetailsService.js');


exports.getDetailsByUserAndItinerary = async (req, res, next) => {
  const { userId, itineraryId } = req.params;
  console.log("getDetailsByUserAndItinerary");
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
    console.log("Error ne: ",error.errors || error)
    next(error);
  }
};


exports.deleteItineraryDetailsByItineraryId = async (req, res, next) => {
  const { itinerary_id } = req.params;

  try {
    await ItineraryDetailService.deleteByItineraryId(itinerary_id);
    res.status(200).json({ message: `Deleted all itinerary details for itinerary_id ${itinerary_id}` });
  } catch (error) {
    console.log("Error ne: ", error.errors || error);
    next(error);
  }
};