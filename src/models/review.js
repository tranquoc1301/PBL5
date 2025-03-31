const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Review = sequelize.define(
    'Review',
    {
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attraction_id: {
        type: DataTypes.INTEGER
      },
      restaurant_id: {
        type: DataTypes.INTEGER
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: DataTypes.TEXT,
      photos: DataTypes.JSONB,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'reviews',
      timestamps: false
    }
  );

  Review.associate = function (models) {
    Review.belongsTo(models.User, { foreignKey: 'user_id' });
    Review.belongsTo(models.Attraction, {
      foreignKey: 'attraction_id',
      allowNull: true
    });
    Review.belongsTo(models.Restaurant, {
      foreignKey: 'restaurant_id',
      allowNull: true
    });
  };

  return Review;
};