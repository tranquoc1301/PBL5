const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const City = sequelize.define(
    "City",
    {
      city_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: DataTypes.TEXT,
      image_url: DataTypes.JSONB,
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
      tableName: "cities",
      timestamps: false,
    }
  );

  City.associate = function (models) {
    City.hasMany(models.Attraction, { foreignKey: "city_id" });
    City.hasMany(models.Restaurant, { foreignKey: "city_id" });
  };

  return City;
};
