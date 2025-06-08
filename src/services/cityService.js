const { City } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const removeAccents = require("remove-accents");

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
    try {
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return [];
      }

      const sanitizedName = removeAccents(name.trim());
      if (sanitizedName.length > 100) {
        throw new Error("Search query cannot exceed 100 characters");
      }

      const cities = await City.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${sanitizedName}%` } },
            Sequelize.where(Sequelize.fn("unaccent", Sequelize.col("name")), {
              [Op.iLike]: `%${sanitizedName}%`,
            }),
          ],
        },
        attributes: {
          include: [
            [
              Sequelize.literal(
                `SIMILARITY(unaccent(name), '${sanitizedName}')`
              ),
              "similarity",
            ],
          ],
        },
        order: [
          [Sequelize.literal("similarity"), "DESC"],
          [Sequelize.col("name"), "ASC"],
        ],
        limit: 100,
      });

      return cities || [];
    } catch (error) {
      console.error("Error searching cities:", error);
      throw new Error("Error searching cities: " + error.message);
    }
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
