const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const ItineraryDay = sequelize.define(
    "ItineraryDay",
    {
      day_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      itinerary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "itineraries",
          key: "itinerary_id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      day_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      optimized_route: {
        type: DataTypes.JSONB,
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
      tableName: "itinerary_days",
      timestamps: false,
    }
  );

  return ItineraryDay;
};
