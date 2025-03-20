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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
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
        allowNull: false,
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
    // Quan hệ n-1: Một Itinerary thuộc về một User
    Itinerary.belongsTo(models.User, { foreignKey: "user_id" });
    // Quan hệ 1-n: Một Itinerary có nhiều ItineraryDay
    Itinerary.hasMany(models.ItineraryDay, { foreignKey: "itinerary_id" });
    // Quan hệ n-n: Itinerary liên kết với User qua bảng ItineraryShare
    Itinerary.belongsToMany(models.User, {
      through: models.ItineraryShare,
      foreignKey: "itinerary_id",
    });
  };
  return Itinerary;
};
