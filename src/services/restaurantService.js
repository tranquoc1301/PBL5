const { Restaurant } = require("../models");
const { Op } = require("sequelize");

class RestaurantService {
  static async getAllRestaurants() {
    return await Restaurant.findAll();
  }

  static async getRestaurantById(id) {
    return await Restaurant.findByPk(id);
  }

  static async getSpecialRestaurantByCity(cityId) {
    return await Restaurant.findAll({
      where: {
        special: true,
        city_id: cityId,
      },
    });
  }

  static async createRestaurant(restaurantData) {
    return await Restaurant.create(restaurantData);
  }

  static async updateRestaurant(id, restaurantData) {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    await restaurant.update(restaurantData);
    return restaurant;
  }

  static async deleteRestaurant(id) {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    await restaurant.destroy();
    return true;
  }
}

module.exports = RestaurantService;
