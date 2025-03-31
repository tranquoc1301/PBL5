const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Article = sequelize.define(
    "Article",
    {
      article_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "published",
        validate: {
          isIn: [["draft", "published", "archived"]],
        },
      },
      images: DataTypes.JSONB,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "articles",
      timestamps: false,
    }
  );

  Article.associate = function (models) {
    Article.belongsTo(models.User, { foreignKey: "user_id" });
    Article.belongsToMany(models.Attraction, {
      through: "article_attractions",
      foreignKey: "article_id",
    });
    Article.belongsToMany(models.Restaurant, {
      through: "article_restaurants",
      foreignKey: "article_id",
    });
    Article.hasMany(models.Comment, { foreignKey: "article_id" });
  };

  return Article;
};
