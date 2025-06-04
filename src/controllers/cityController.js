const CityService = require("../services/cityService");
const { cloudinaryInstance } = require("./../config/configureCloudinary");

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

  static async getCityByName(req, res) {
    try {
      const { name } = req.params;
      const city = await CityService.getCityByName(name);
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

  static async uploadImages(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinaryInstance.uploader.upload_stream(
              { folder: "cities" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );
            stream.end(file.buffer);
          })
      );

      const imageUrls = await Promise.all(uploadPromises);
      res.status(200).json({ imageUrls });
    } catch (error) {
      console.error("Error uploading images:", error);
      res
        .status(400)
        .json({ message: "Failed to upload images", error: error.message });
    }
  }

  static async createCity(req, res) {
    try {
      const cityData = req.body;
      cityData.image_url = cityData.image_url
        ? JSON.parse(cityData.image_url)
        : [];
      const newCity = await CityService.createCity(cityData);
      res.status(201).json(newCity);
    } catch (error) {
      console.error("Error creating city:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async updateCity(req, res) {
    try {
      const { id } = req.params;
      const cityData = req.body;
      cityData.image_url = cityData.image_url
        ? JSON.parse(cityData.image_url)
        : [];

      // Delete old images if new ones are provided
      if (cityData.image_url.length > 0) {
        const existingCity = await CityService.getCityById(id);
        if (existingCity.image_url && existingCity.image_url.length > 0) {
          const deletePromises = existingCity.image_url.map((url) => {
            const publicId = url.split("/").pop().split(".")[0];
            return cloudinaryInstance.uploader.destroy(`cities/${publicId}`);
          });
          await Promise.all(deletePromises);
        }
      }

      const updatedCity = await CityService.updateCity(id, cityData);
      res.status(200).json(updatedCity);
    } catch (error) {
      console.error("Error updating city:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async deleteCity(req, res) {
    try {
      const { id } = req.params;
      const city = await CityService.getCityById(id);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }

      if (city.image_url && city.image_url.length > 0) {
        const deletePromises = city.image_url.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinaryInstance.uploader.destroy(`cities/${publicId}`);
        });
        await Promise.all(deletePromises);
      }

      await CityService.deleteCity(id);
      res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
      console.error("Error deleting city:", error);
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
}

module.exports = CityController;
