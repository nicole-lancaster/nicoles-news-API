const {
  fetchArticlesById,
  fetchAllArticles,
} = require("../models/articles.models.js");

const getAllArticles = (request, response, next) => {
  fetchAllArticles()
    .then((articles) => {
      return response.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticlesById = (request, response, next) => {
  const { article_id } = request.params;
  const articlePromise = fetchArticlesById(article_id);
  articlePromise
    .then((article) => {
      return response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticlesById, getAllArticles };
