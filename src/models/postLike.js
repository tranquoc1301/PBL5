const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PostLike = sequelize.define(
    'PostLike',
    {
      like_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'post_likes',
      timestamps: false
    }
  );

  PostLike.associate = function (models) {
    PostLike.belongsTo(models.User, { foreignKey: 'user_id' });
    PostLike.belongsTo(models.Post, { foreignKey: 'post_id' });
  };

  return PostLike;
};