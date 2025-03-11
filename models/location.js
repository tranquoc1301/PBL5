const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Location = sequelize.define(
    "Location",
    {
      location_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      address: {
        type: DataTypes.STRING(255),
      },
      latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },
      average_rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        validate: {
          min: 0,
          max: 5,
        },
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tags: {
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
      tableName: "locations",
      timestamps: false,
    }
  );

  return Location;
};
