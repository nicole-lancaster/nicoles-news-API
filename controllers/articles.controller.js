const articles = require("../db/data/test-data/articles.js");
const { fetchArticlesById } = require("../models/articles.models.js");

const getArticlesById = (request, response) => {
  const { article_id } = request.params;

  return fetchArticlesById(article_id).then((article) => {
    response.status(200).send({ article: article });
  });
};

module.exports = { getArticlesById };
