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
