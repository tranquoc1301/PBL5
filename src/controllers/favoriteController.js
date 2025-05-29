const FavoriteService = require("../services/favoriteService");

const createFavorite = async (req, res) => {
  const { user_id, attraction_id, restaurant_id } = req.body;

  if (
    (attraction_id === undefined && restaurant_id === undefined) ||
    (attraction_id !== undefined && restaurant_id !== undefined)
  ) {
    return res.status(400).json({
      error: "Exactly one of attraction_id or restaurant_id must be provided.",
    });
  }

  try {
    const favorite = await FavoriteService.createFavorite(
      user_id,
      attraction_id || null,
      restaurant_id || null
    );
    res.status(201).json("Favorite added successfully ");
  } catch (error) {
    console.error("Error in createFavorite:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  const { favorite_id } = req.params;
  try {
    const success = await FavoriteService.deleteFavorite(favorite_id);
    if (success) {
      res.status(200).json({ message: "Favorite deleted successfully" });
    } else {
      res.status(404).json({ error: "Favorite not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFavoritesByUser = async (req, res) => {
  const { user_id } = req.params;
  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  try {
    const favorites = await FavoriteService.getFavoritesByUser(user_id);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createFavorite,
  deleteFavorite,
  getFavoritesByUser,
};
