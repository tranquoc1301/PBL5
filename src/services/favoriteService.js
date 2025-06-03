const { Favorite, Attraction, Restaurant } = require("../models");

class FavoriteService {
  async createFavorite(userId, attractionId = null, restaurantId = null) {
    try {
      const favorite = await Favorite.create({
        user_id: userId,
        attraction_id: attractionId,
        restaurant_id: restaurantId,
        created_at: new Date(),
      });
      return favorite;
    } catch (error) {
      console.error("Error creating favorite:", error.message, error.stack);
      throw new Error(`Failed to create favorite: ${error.message}`);
    }
  }

  async deleteFavorite(favoriteId) {
    try {
      const result = await Favorite.destroy({
        where: { favorite_id: favoriteId },
      });
      return result > 0;
    } catch (error) {
      console.error("Error deleting favorite:", error.message, error.stack);
      throw new Error(`Failed to delete favorite: ${error.message}`);
    }
  }

  async getFavoritesByUser(userId) {
    try {
      const favorites = await Favorite.findAll({
        where: { user_id: userId },
        include: [
          {
            model: Attraction,
            as: "Attraction",
            required: false,
            attributes: [
              "attraction_id",
              "name",
              "description",
              "address",
              "average_rating",
              "rating_total",
              "image_url",
              "tags",
            ],
          },
          {
            model: Restaurant,
            as: "Restaurant",
            required: false,
            attributes: [
              "restaurant_id",
              "name",
              "description",
              "address",
              "average_rating",
              "rating_total",
              "image_url",
              "tags",
              "phone_number",
              "hours",
            ],
          },
        ],
        order: [["created_at", "DESC"]],
      });
      return favorites;
    } catch (error) {
      console.error("Error fetching favorites:", error.message, error.stack);
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }
  }
}

module.exports = new FavoriteService();
