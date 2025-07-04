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
      cover_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "user",
        validate: {
          isIn: [["user", "admin"]],
        },
      },
      bio: {
        type: DataTypes.JSONB,
        defaultValue: {
          currentCity: "",
          about: "",
          website: "",
          location_preferences: [],
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
  };

  return User;
};
