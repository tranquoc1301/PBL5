const { Itinerary } = require('../models');
const { Op, literal } = require("sequelize");

const { Sequelize } = require("sequelize");
const ItineraryService = {
  createItinerary: async (data) => {
    try {
      const itinerary = await Itinerary.create(data);
      return itinerary;
    } catch (error) {
      console.error("Error creating itinerary:", error);
      throw error;
    }
  },
};

module.exports = ItineraryService;