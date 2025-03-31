const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ArticleAttraction = sequelize.define(
    'ArticleAttraction',
    {},
    {
      tableName: 'article_attractions',
      timestamps: false
    }
  );

  return ArticleAttraction;
};