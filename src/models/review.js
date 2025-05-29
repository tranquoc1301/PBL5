const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Review = sequelize.define(
    "Review",
    {
      review_id: {
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      visit_type: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      companion: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      photos: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
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
      tableName: "reviews",
      timestamps: false,
    }
  );

  Review.associate = function (models) {
    Review.belongsTo(models.User, { foreignKey: "user_id" });
    Review.belongsTo(models.Attraction, {
      foreignKey: "attraction_id",
      allowNull: true,
    });
    Review.belongsTo(models.Restaurant, {
      foreignKey: "restaurant_id",
      allowNull: true,
    });
  };

  return Review;
};
