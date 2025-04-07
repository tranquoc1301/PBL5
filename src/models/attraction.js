const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Attraction = sequelize.define(
    'Attraction',
    {
      attraction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: DataTypes.TEXT,
      latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
      },
      city_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      address: DataTypes.STRING(255),
      average_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5
        }
      },
      image_url: DataTypes.JSONB,
      tags: DataTypes.JSONB,
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
      tableName: 'attractions',
      timestamps: false
    }
  );

  Attraction.associate = function (models) {
    Attraction.belongsTo(models.City, { foreignKey: 'city_id' });
    Attraction.hasMany(models.Review, { foreignKey: 'attraction_id' });
    Attraction.belongsToMany(models.Activity, {
      through: 'activities',
      foreignKey: 'attraction_id'
    });
    Attraction.belongsToMany(models.Article, {
      through: 'article_attractions',
      foreignKey: 'attraction_id'
    });
    Attraction.belongsToMany(models.Favorite, {
      through: 'favorites',
      foreignKey: 'attraction_id'
    });
  };

  return Attraction;
};