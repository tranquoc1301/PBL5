const CityService = require("../services/cityService");

class CityController {
  static async getAllCities(req, res) {
    try {
      const cities = await CityService.getAllCities();
      res.status(200).json(cities);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  static async getCityById(req, res) {
    try {
      const { id } = req.params;
      const city = await CityService.getCityById(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.status(200).json(city);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  static async createCity(req, res) {
    try {
      const cityData = req.body;
      const newCity = await CityService.createCity(cityData);
      res.status(201).json(newCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async updateCity(req, res) {
    try {
      const { id } = req.params;
      const cityData = req.body;
      const updatedCity = await CityService.updateCity(id, cityData);
      res.status(200).json(updatedCity);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteCity(req, res) {
    try {
      const { id } = req.params;
      await CityService.deleteCity(id);
      res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
}

module.exports = CityController;
