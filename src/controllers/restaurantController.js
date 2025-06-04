const RestaurantService = require("../services/restaurantService");
const { cloudinaryInstance } = require("../config/configureCloudinary");

class RestaurantController {
  // Get all restaurants
  static async getAllRestaurants(req, res) {
    try {
      const restaurants = await RestaurantService.getAllRestaurants();
      res.status(200).json(restaurants);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  // Get restaurant by ID
  static async getRestaurantById(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantService.getRestaurantById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.status(200).json(restaurant);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  // Get special restaurants by city
  static async getSpecialRestaurantByCity(req, res) {
    try {
      const { city_id } = req.params;
      const specialRestaurants =
        await RestaurantService.getSpecialRestaurantByCity(city_id);
      res.status(200).json(specialRestaurants);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }

  // Get restaurant rank
  static async getRestaurantRank(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const rank = await RestaurantService.getRestaurantRank(restaurantId);
      if (!rank) {
        return res.status(404).json({ message: "Restaurant not found!" });
      }
      res.status(200).json({ restaurantId: restaurantId, rank });
    } catch (error) {
      next(error);
    }
  }

  // Get nearby top restaurants
  static async getNearbyTopRestaurant(req, res, next) {
    try {
      const { restaurantId } = req.params;
      const nearbyTopRestaurant =
        await RestaurantService.getNearbyTopRestaurant(restaurantId);
      if (!nearbyTopRestaurant) {
        return res.status(404).json({ message: "Restaurant not found!" });
      }
      res.status(200).json({ nearbyTopRestaurant });
    } catch (error) {
      next(error);
    }
  }

  // Upload images to Cloudinary
  static async uploadImages(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinaryInstance.uploader.upload_stream(
              { folder: "restaurants" }, // Store in 'restaurants' folder on Cloudinary
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

  // Create a new restaurant
  static async createRestaurant(req, res) {
    try {
      const restaurantData = req.body;
      // Normalize image_url to an array
      let imageUrl = restaurantData.image_url || [];
      if (typeof imageUrl === "string") {
        if (imageUrl.trim().startsWith("[")) {
          try {
            imageUrl = JSON.parse(imageUrl);
          } catch (e) {
            return res.status(400).json({
              message: "image_url must be a valid JSON array or string",
            });
          }
        } else {
          imageUrl = [imageUrl];
        }
      }
      restaurantData.image_url = Array.isArray(imageUrl) ? imageUrl : [];

      const newRestaurant = await RestaurantService.createRestaurant(
        restaurantData
      );
      res.status(201).json(newRestaurant);
    } catch (error) {
      console.error("Error creating restaurant:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // Update a restaurant
  static async updateRestaurant(req, res) {
    try {
      const { id } = req.params;
      const restaurantData = req.body;
      // Normalize image_url to an array
      let imageUrl = restaurantData.image_url || [];
      if (typeof imageUrl === "string") {
        if (imageUrl.trim().startsWith("[")) {
          try {
            imageUrl = JSON.parse(imageUrl);
          } catch (e) {
            return res.status(400).json({
              message: "image_url must be a valid JSON array or string",
            });
          }
        } else {
          imageUrl = [imageUrl];
        }
      }
      restaurantData.image_url = Array.isArray(imageUrl) ? imageUrl : [];

      // Delete old images if new ones are provided
      if (restaurantData.image_url.length > 0) {
        const existingRestaurant = await RestaurantService.getRestaurantById(
          id
        );
        if (
          existingRestaurant.image_url &&
          existingRestaurant.image_url.length > 0
        ) {
          const deletePromises = existingRestaurant.image_url.map((url) => {
            const publicId = url.split("/").pop().split(".")[0];
            return cloudinaryInstance.uploader.destroy(
              `restaurants/${publicId}`
            );
          });
          await Promise.all(deletePromises);
        }
      }

      const updatedRestaurant = await RestaurantService.updateRestaurant(
        id,
        restaurantData
      );
      res.status(200).json(updatedRestaurant);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a restaurant
  static async deleteRestaurant(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await RestaurantService.getRestaurantById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Delete associated images from Cloudinary
      if (restaurant.image_url && restaurant.image_url.length > 0) {
        const deletePromises = restaurant.image_url.map((url) => {
          const publicId = url.split("/").pop().split(".")[0];
          return cloudinaryInstance.uploader.destroy(`restaurants/${publicId}`);
        });
        await Promise.all(deletePromises);
      }

      await RestaurantService.deleteRestaurant(id);
      res.status(204).json({ message: "Restaurant deleted successfully" });
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      res
        .status(500)
        .json({ message: "Internal Server error", error: error.message });
    }
  }
}

module.exports = RestaurantController;
