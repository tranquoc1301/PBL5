const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Favorite = sequelize.define(
    'Favorite',
    {
      favorite_id: {
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
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'favorites',
      timestamps: false
    }
  );

  Favorite.associate = function (models) {
    Favorite.belongsTo(models.User, { foreignKey: 'user_id' });
    Favorite.belongsTo(models.Attraction, {
      foreignKey: 'attraction_id',
      allowNull: true
    });
    Favorite.belongsTo(models.Restaurant, {
      foreignKey: 'restaurant_id',
      allowNull: true
    });
  };

  return Favorite;
};