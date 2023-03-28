const articles = require("../db/data/test-data/articles.js");
const { fetchArticlesById } = require("../models/articles.models.js");
const { customErrorMiddleware } = require("./error.controllers.js");

const getArticlesById = (request, response, next) => {
  const { article_id } = request.params;
  const isNum = Number(article_id);
  if (!isNum && isNum !== 0) {
    const err = { status: 400, msg: "Article ID invalid - must be a number" }
    next(err)
  }
  const articlePromise = fetchArticlesById(article_id);
  articlePromise
    .then((article) => {
      return response.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticlesById };
