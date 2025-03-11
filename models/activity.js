const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Activity = sequelize.define(
    "Activity",
    {
      activity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      day_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "itinerary_days",
          key: "day_id",
        },
      },
      location_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "locations",
          key: "location_id",
        },
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      activity_type: {
        type: DataTypes.STRING(50),
        validate: {
          isIn: [["visit", "transport", "meal", "rest", "other"]],
        },
      },
      activity_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "activities",
      timestamps: false,
    }
  );

  return Activity;
};
