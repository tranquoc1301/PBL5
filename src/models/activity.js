const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Activity = sequelize.define(
    'Activity',
    {
      activity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      day_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      attraction_id: {
        type: DataTypes.INTEGER
      },
      restaurant_id: {
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      notes: DataTypes.TEXT,
      activity_type: {
        type: DataTypes.STRING(50),
        validate: {
          isIn: [
            'visit',
            'transport',
            'meal',
            'rest',
            'other',
            'post'
          ]
        }
      },
      activity_order: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
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
      tableName: 'activities',
      timestamps: false
    }
  );

  Activity.associate = function (models) {
    Activity.belongsTo(models.ItineraryDay, { foreignKey: 'day_id' });
    Activity.belongsTo(models.Attraction, {
      foreignKey: 'attraction_id',
      allowNull: true
    });
    Activity.belongsTo(models.Restaurant, {
      foreignKey: 'restaurant_id',
      allowNull: true
    });
  };

  return Activity;
};