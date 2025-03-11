const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Article = sequelize.define(
    "Article",
    {
      article_id: {
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
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      images: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "published",
        validate: {
          isIn: [["draft", "published", "archived"]],
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
      tableName: "articles",
      timestamps: false,
    }
  );

  return Article;
};
