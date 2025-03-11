const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      favorite_id: {
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
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "locations",
          key: "location_id",
        },
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "favorites",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["user_id", "location_id"],
        },
      ],
    }
  );

  return Favorite;
};
