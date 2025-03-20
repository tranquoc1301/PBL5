const { DataTypes } = require("sequelize");

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
      open_time: {
        type: DataTypes.TIME,
      },
      close_time: {
        type: DataTypes.TIME,
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
      category: {
        type: DataTypes.STRING(50),
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

  Location.associate = function (models) {
    // Quan hệ 1-n: Một Location có nhiều Post
    Location.hasMany(models.Post, { foreignKey: "location_id" });
    // Quan hệ n-n: Location liên kết với Article qua bảng ArticleLocation
    Location.belongsToMany(models.Article, {
      through: models.ArticleLocation,
      foreignKey: "location_id",
    });
  };
  
  return Location;
};
