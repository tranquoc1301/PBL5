const { Attraction } = require("../models");
const { Op } = require("sequelize");

class AttractionService {
  static async getAllAttractions() {
    return await Attraction.findAll();
  }

  static async getAttractionById(attractionId) {
    return await Attraction.findByPk(attractionId);
  }

  static async createAttraction(data) {
    return await Attraction.create(data);
  }

  static async updateAttraction(attractionId, data) {
    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) throw new Error("Địa điểm không tồn tại");
    return await attraction.update(data);
  }

  static async deleteAttraction(attractionId) {
    const attraction = await Attraction.findByPk(attractionId);
    if (!attraction) throw new Error("Địa điểm không tồn tại");
    return await attraction.destroy();
  }

  static async searchAttractions(query) {
    return await Attraction.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });
  }
}

module.exports = AttractionService;
