const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ArticleRestaurant = sequelize.define(
    'ArticleRestaurant',
    {},
    {
      tableName: 'article_restaurants',
      timestamps: false
    }
  );

  return ArticleRestaurant;
};