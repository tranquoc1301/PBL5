const { Article } = require("../models");

const createArticle = async (data) => {
  return await Article.create(data);
};

const getAllArticles = async () => {
  return await Article.findAll({ order: [["created_at", "DESC"]] });
};

const getArticleById = async (id) => {
  return await Article.findByPk(id);
};

const updateArticle = async (id, newData) => {
  const article = await Article.findByPk(id);
  if (!article) throw new Error("Article not found");
  return await article.update(newData);
};

const deleteArticle = async (id) => {
  const article = await Article.findByPk(id);
  if (!article) throw new Error("Article not found");
  await article.destroy();
  return true;
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
