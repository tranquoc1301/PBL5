const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
  `postgres://postgres:${process.env.DB_PASSWORD}@localhost:5432/pbl5`,
  {
    dialect: "postgres",
    logging: false,
  }
);
const ArticleModel = require("../models/article");
const Article = ArticleModel(sequelize);

// Lấy tất cả bài viết
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy bài viết theo ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tạo bài viết mới
exports.createArticle = async (req, res) => {
  try {
    const { user_id, title, content, images, status } = req.body;

    if (!user_id || !title || !content) {
      return res
        .status(400)
        .json({ error: "user_id, title và content là bắt buộc" });
    }

    const newArticle = await Article.create({
      user_id,
      title,
      content,
      images,
      status,
    });

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật bài viết
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, images, status } = req.body;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await article.update({ title, content, images, status });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa bài viết
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    await article.destroy();
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
