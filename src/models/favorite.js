const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      favorite_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      attraction_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      restaurant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "favorites",
      timestamps: false,
      validate: {
        exactlyOneOfAttractionOrRestaurant() {
          if (
            (this.attraction_id === null && this.restaurant_id === null) ||
            (this.attraction_id !== null && this.restaurant_id !== null)
          ) {
            throw new Error(
              "Exactly one of attraction_id or restaurant_id must be non-null."
            );
          }
        },
      },
    }
  );

  Favorite.associate = function (models) {
    Favorite.belongsTo(models.User, { foreignKey: "user_id" });
    Favorite.belongsTo(models.Attraction, {
      foreignKey: "attraction_id",
      as: "Attraction",
      allowNull: true,
    });
    Favorite.belongsTo(models.Restaurant, {
      foreignKey: "restaurant_id",
      as: "Restaurant",
      allowNull: true,
    });
  };

  return Favorite;
};
