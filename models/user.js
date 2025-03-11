const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
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

  return User;
};
