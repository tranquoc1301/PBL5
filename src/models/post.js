const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define(
    'Post',
    {
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      caption: DataTypes.TEXT,
      images: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'posts',
      timestamps: false
    }
  );

  Post.associate = function (models) {
    Post.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Post;
};