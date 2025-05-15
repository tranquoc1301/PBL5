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
      console.log("Fetching favorites for user:", userId);
      const favorites = await Favorite.findAll({
        where: { user_id: userId },
        include: [
          { model: Attraction, as: "Attraction" },
          { model: Restaurant, as: "Restaurant" },
        ],
      });
      console.log("Favorites fetched:", JSON.stringify(favorites, null, 2));
      return favorites;
    } catch (error) {
      console.error("Error fetching favorites:", error.message, error.stack);
      throw new Error(`Failed to fetch favorites: ${error.message}`);
    }
  }
}

module.exports = new FavoriteService();
