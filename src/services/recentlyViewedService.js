const { RecentlyViewed } = require("../models");
const { Op } = require("sequelize");

const createRecentlyViewed = async (user_id, item) => {
  await RecentlyViewed.destroy({
    where: {
      user_id,
      [Op.and]: [{ item: { id: item.id } }, { item: { type: item.type } }],
    },
  });

  const recentlyViewed = await RecentlyViewed.create({
    user_id,
    item,
    viewed_at: new Date(),
  });

  return recentlyViewed;
};

const getRecentlyViewed = async (user_id) => {
  const recentlyViewed = await RecentlyViewed.findAll({
    where: { user_id },
    order: [["viewed_at", "DESC"]],
    limit: 4,
    attributes: ["item"],
  });

  return recentlyViewed.map((record) => record.item);
};

module.exports = {
  createRecentlyViewed,
  getRecentlyViewed,
};
