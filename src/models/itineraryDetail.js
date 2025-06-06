const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ItineraryDetail = sequelize.define(
    "ItineraryDetail",
    {
      detail_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      itinerary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "itineraries",
          key: "itinerary_id",
        },
        onDelete: "CASCADE",
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          isIn: [["attraction", "restaurant"]],
        },
      },
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      arrival_time: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      departure_time: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      travel_from_prev_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      average_rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      rating_total: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tags: DataTypes.JSONB,
      image_url: DataTypes.JSONB, 
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      warning: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "itinerary_details",
      timestamps: false,
      id: false,
    }
  );

  ItineraryDetail.associate = function (models) {
    ItineraryDetail.belongsTo(models.User, { foreignKey: "user_id" });
    ItineraryDetail.belongsTo(models.Itinerary, { foreignKey: "itinerary_id" });
  };

  return ItineraryDetail;
};