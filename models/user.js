module.exports = (sequelize, DataTypes) => {
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
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      full_name: DataTypes.STRING(100),
      avatar_url: DataTypes.STRING(255),
      bio: DataTypes.TEXT,
      location_preference: DataTypes.STRING(100),
      travel_interests: DataTypes.JSONB,
      social_links: DataTypes.JSONB,
      notification_preferences: DataTypes.JSONB,
      created_at: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      role: {
        type: DataTypes.STRING(20),
        defaultValue: "user",
        validate: {
          isIn: [["user", "admin"]],
        },
      },
    },
    {
      tableName: "Users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
  return User;
};
