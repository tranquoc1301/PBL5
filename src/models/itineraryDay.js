const { DataTypes } = require("sequelize");

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
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      day_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      optimized_route: DataTypes.JSONB,
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

  ItineraryDay.associate = function (models) {
    ItineraryDay.belongsTo(models.Itinerary, { foreignKey: "itinerary_id" });
    ItineraryDay.hasMany(models.Activity, { foreignKey: "day_id" });
  };

  return ItineraryDay;
};
