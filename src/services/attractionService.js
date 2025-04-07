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
  
  static async getSpecialAttractionsByCity(cityId) {
    const attractions = await Attraction.findAll({
      where: {
        special: true,
        city_id: cityId,
      },
    });
  
    if (!attractions || attractions.length === 0) {
      throw new Error("Không tìm thấy địa điểm nổi bật nào cho thành phố này");
    }
  
    return attractions;
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
