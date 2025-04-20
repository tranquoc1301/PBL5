const { City } = require("../models");
const { Op } = require("sequelize");

class CityService {
  static async getAllCities() {
    return await City.findAll();
  }

  static async getCityById(id) {
    return await City.findByPk(id);
  }

  static async createCity(cityData) {
    return await City.create(cityData);
  }

  static async getCityByName(name) {
    const city = await City.findOne({ where: { name: {
      [Op.like]: `%${name}%`
    } } });
    return city; // Trả về null nếu không tìm thấy, controller sẽ xử lý
  }

  static async updateCity(id, cityData) {
    const city = await City.findByPk(id);
    if (!city) {
      throw new Error("City not found");
    }
    await city.update(cityData);
    return city;
  }

  static async deleteCity(id) {
    const city = await City.findByPk(id);
    if (!city) {
      throw new Error("City not found");
    }
    await city.destroy();
    return true;
  }
}

module.exports = CityService;
