const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
    {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      caption: {
        type: DataTypes.TEXT,
      },
      images: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "posts",
      timestamps: false,
    }
  );

  Post.associate = function (models) {
    // Quan hệ n-1: Một Post thuộc về một User
    Post.belongsTo(models.User, { foreignKey: "user_id" });
    // Quan hệ n-1: Một Post thuộc về một Location
    Post.belongsTo(models.Location, { foreignKey: "location_id" });
    // Quan hệ 1-n: Một Post có nhiều PostLike
    Post.hasMany(models.PostLike, { foreignKey: "post_id" });
  };
  return Post;
};
