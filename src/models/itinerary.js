const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Itinerary = sequelize.define(
    "Itinerary",
    {
      itinerary_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "private",
        validate: {
          isIn: [["public", "private", "shared"]],
        },
      },
      optimized: {
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
    },
    {
      tableName: "itineraries",
      timestamps: false,
    }
  );

  Itinerary.associate = function (models) {
    Itinerary.belongsTo(models.User, { foreignKey: "user_id" });
    Itinerary.hasMany(models.ItineraryDay, { foreignKey: "itinerary_id" });
    Itinerary.belongsToMany(models.User, {
      through: models.ItineraryShare,
      foreignKey: "itinerary_id",
    });
  };

  return Itinerary;
};
