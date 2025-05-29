const recentlyViewedService = require("../services/recentlyViewedService");

const createRecentlyViewed = async (req, res) => {
  const { user_id, item } = req.body;

  if (
    !user_id ||
    !item ||
    !item.id ||
    !item.name ||
    !item.type ||
    !["attraction", "restaurant"].includes(item.type)
  ) {
    return res
      .status(400)
      .json({
        error: "Invalid input: user_id and item (id, name, type) required",
      });
  }

  try {
    const result = await recentlyViewedService.createRecentlyViewed(
      user_id,
      item
    );
    return res.status(201).json(result);
  } catch (error) {
    console.error("Error saving recently viewed:", error);
    return res
      .status(500)
      .json({ error: "Failed to save recently viewed item" });
  }
};

const getRecentlyViewed = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id required" });
  }

  try {
    const items = await recentlyViewedService.getRecentlyViewed(user_id);
    return res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching recently viewed:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch recently viewed items" });
  }
};

module.exports = {
  createRecentlyViewed,
  getRecentlyViewed,
};
