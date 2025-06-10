const { Itinerary } = require("../models");
const { Op, literal } = require("sequelize");

const { Sequelize } = require("sequelize");
const itinerary = require("../models/itinerary");
// const ItineraryService = {
//   createItinerary: async (data) => {
//     try {
//       const itinerary = await Itinerary.create(data);
//       return itinerary;
//     } catch (error) {
//       console.error("Error creating itinerary:", error);
//       throw error;
//     }
//   },

//   getItinerarybyUser: async (data) => {
//     try {
//       const itinerary = await Itinerary.fi
//     }
//   }
// };
exports.getAllItineraries = async () => {
  return await Itinerary.findAll();
};
exports.updateItinerary = async (itinerary_id, data) => {
  const [updatedCount] = await Itinerary.update(data, {
    where: { itinerary_id },
  });

  if (updatedCount === 0) return null;

  return await Itinerary.findByPk(itinerary_id);
};
exports.createItinerary = async (data) => {
  try {
    const itinerary = await Itinerary.create(data);
    return itinerary;
  } catch (error) {
    console.error("Error creating itinerary:", error);
    throw error;
  }
};

exports.getFinishedItinerarybyUser = async (user_id) => {
  return await Itinerary.findAll({
    where: {
      user_id: user_id,
      end_date: {
        [Op.lt]: literal("CURRENT_DATE"),
      },
    },
  });
};

exports.getItinerarybyId = async (id) => {
  return await Itinerary.findAll({
    where: {
      itinerary_id: id,
    },
  });
};

exports.getNotFinishedItinerarybyUser = async (user_id) => {
  return await Itinerary.findAll({
    where: {
      user_id: user_id,
      end_date: {
        [Op.gte]: literal("CURRENT_DATE"),
      },
    },
  });
};
// module.exports = ItineraryService;
