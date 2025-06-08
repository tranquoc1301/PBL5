const { DataTypes } = require("sequelize");

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
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      cover_image: {
        type: DataTypes.STRING,
        allowNull: false, // Ảnh bìa lớn, không cho phép NULL
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        /**
         * Ví dụ:
         * [
         *   {
         *     "text": "Đây là đoạn đầu tiên",
         *     "images": ["img1.jpg", "img2.jpg"]
         *   },
         *   {
         *     "text": "Đây là đoạn thứ hai",
         *     "images": []
         *   }
         * ]
         */
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: "draft", // Cập nhật giá trị mặc định khớp với CSDL
        validate: {
          isIn: [["draft", "published", "archived"]],
        },
      },
      created_at: {
        type: DataTypes.DATE,
        // Bỏ defaultValue để CSDL tự động gán CURRENT_TIMESTAMP
      },
      updated_at: {
        type: DataTypes.DATE,
        // Bỏ defaultValue để CSDL tự động gán CURRENT_TIMESTAMP
      },
    },
    {
      tableName: "articles",
      timestamps: false, // Vì CSDL đã có created_at và updated_at
    }
  );

  Article.associate = function (models) {
    Article.belongsTo(models.User, { foreignKey: "user_id" });
    Article.belongsToMany(models.Attraction, {
      through: "article_attractions",
      foreignKey: "article_id",
    });
    Article.belongsToMany(models.Restaurant, {
      through: "article_restaurants",
      foreignKey: "article_id",
    });
    Article.hasMany(models.Comment, { foreignKey: "article_id" });
  };

  return Article;
};
