const { ItineraryDetail } = require("../models");
const { Op, literal } = require("sequelize");

const { Sequelize } = require("sequelize");

exports.getDetailsByUserAndItinerary = async (userId, itineraryId) => {
  return await ItineraryDetail.findAll({
    where: {
      user_id: userId,
      itinerary_id: itineraryId,
    },
  });
};

exports.createItineraryDetail = async (data) => {
  try {
    const itinerary = await ItineraryDetail.create(data);
    return itinerary;
  } catch (error) {
    console.error("Error creating itinerary:", error);
    throw error;
  }
}

exports.deleteByItineraryId = async (itinerary_id) => {
  return await ItineraryDetail.destroy({
    where: { itinerary_id },
  });
};