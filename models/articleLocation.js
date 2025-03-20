const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ArticleLocation = sequelize.define('ArticleLocation', {
    article_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    location_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  }, {
    tableName: 'article_locations',
    timestamps: false,
  });

  return ArticleLocation;
};