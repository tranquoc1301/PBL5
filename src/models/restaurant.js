const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Restaurant = sequelize.define(
    "Restaurant",
    {
      restaurant_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false,
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: DataTypes.STRING(255),
      phone_number: DataTypes.STRING(20),
      open_time: DataTypes.TIME,
      close_time: DataTypes.TIME,
      average_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      image_url: DataTypes.JSONB,
      tags: DataTypes.JSONB,
      reservation_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      rating_total: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      }
    },
    {
      tableName: "restaurants",
      timestamps: false,
    }
  );

  Restaurant.associate = function (models) {
    Restaurant.belongsTo(models.City, { foreignKey: "city_id" });
    Restaurant.hasMany(models.Review, { foreignKey: "restaurant_id" });
    Restaurant.belongsToMany(models.Activity, {
      through: "activities",
      foreignKey: "restaurant_id",
    });
    Restaurant.belongsToMany(models.Article, {
      through: "article_restaurants",
      foreignKey: "restaurant_id",
    });
    Restaurant.belongsToMany(models.Favorite, {
      through: "favorites",
      foreignKey: "restaurant_id",
    });
  };

  return Restaurant;
};
