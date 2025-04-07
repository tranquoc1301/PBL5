const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      google_id: {
        type: DataTypes.STRING(50),
        unique: true,
      },
      username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password_reset_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password_reset_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING(100),
      },
      avatar_url: {
        type: DataTypes.STRING(255),
      },
      bio: {
        type: DataTypes.TEXT,
      },
      location_preference: {
        type: DataTypes.STRING(100),
      },
      social_links: {
        type: DataTypes.JSONB,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "user",
        validate: {
          isIn: [["user", "admin"]],
        },
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
      tableName: "users",
      timestamps: false,
    }
  );

  User.associate = function (models) {
    // Quan hệ 1-n: Một User có nhiều Itinerary
    User.hasMany(models.Itinerary, { foreignKey: "user_id" });
    // Quan hệ 1-n: Một User có nhiều Post
    User.hasMany(models.Post, { foreignKey: "user_id" });
    // Quan hệ n-n: User liên kết với Itinerary qua bảng ItineraryShare
    User.belongsToMany(models.Itinerary, {
      through: models.ItineraryShare,
      foreignKey: "user_id",
    });
  };

  return User;
};
