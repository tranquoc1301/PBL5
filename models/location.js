module.exports = (sequelize, DataTypes) => {
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
      description: DataTypes.TEXT,
      address: DataTypes.STRING(255),
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
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        field: "created_at",
      },
    },
    {
      tableName: "Locations",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
  return Location;
};
