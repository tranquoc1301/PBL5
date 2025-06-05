const { Itinerary } = require('../models');
const { Op, literal } = require("sequelize");

const { Sequelize } = require("sequelize");
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

exports.createItinerary = async (data) => {
  try {
    const itinerary = await Itinerary.create(data);
    return itinerary;
  } catch (error) {
    console.error("Error creating itinerary:", error);
    throw error;
  }
}

exports.getFinishedItinerarybyUser = async (user_id) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return await Itinerary.findAll({
    where: {
      user_id: user_id,
       end_date: {
        [Op.lt]: today,
      },
    },
  });
}


exports.getNotFinishedItinerarybyUser = async (user_id) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return await Itinerary.findAll({
    where: {
      user_id: user_id,
       end_date: {
        [Op.gte]: today,
      },
    },
  });
}
// module.exports = ItineraryService;