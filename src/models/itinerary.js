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
        references: {
          model: "users",
          key: "user_id",
        },
        onDelete: "CASCADE",
      },
      city_name: {
        type: DataTypes.TEXT,
      },
      city_id: {
        type: DataTypes.INTEGER,
      },
      image_url: {
        type: DataTypes.TEXT,
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
  };

  return Itinerary;
};
