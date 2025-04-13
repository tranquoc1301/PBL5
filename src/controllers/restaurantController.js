const RestaurantService = require("../services/restaurantService");

class RestaurantController {
  static async getAllRestaurants(req, res) {
    try {
      const restaurants = await RestaurantService.getAllRestaurants();
      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Internal Server error", error: error.message });
    }
  }

  static async getRestaurantById(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantService.getRestaurantById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ message: "Internal Server error", error: error.message });
    }
  }

  static async getSpecialRestaurantByCity(req, res) {
    try {
      const { city_id } = req.params;
      const specialRestaurants = await RestaurantService.getSpecialRestaurantByCity(city_id);
      res.status(200).json(specialRestaurants);
    } catch (error) {
      res.status(500).json({ message: "Internal Server error", error: error.message });
    }
  }

  static async createRestaurant(req, res) {
    try {
      const restaurantData = req.body;
      const newRestaurant = await RestaurantService.createRestaurant(restaurantData);
      res.status(201).json(newRestaurant);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateRestaurant(req, res) {
    try {
      const { id } = req.params;
      const restaurantData = req.body;
      const updatedRestaurant = await RestaurantService.updateRestaurant(id, restaurantData);
      res.status(200).json(updatedRestaurant);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteRestaurant(req, res) {
    try {
      const { id } = req.params;
      await RestaurantService.deleteRestaurant(id);
      res.status(204).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server error", error: error.message });
    }
  }
}

module.exports = RestaurantController;