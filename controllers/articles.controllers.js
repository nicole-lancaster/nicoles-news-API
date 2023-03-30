const {
  fetchArticlesById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
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

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const articlePromise = fetchArticlesById(article_id);
  articlePromise
    .then(() => {
      const commentsPromise = fetchCommentsByArticleId(article_id);
      commentsPromise
        .then((comments) => {
          return response.status(200).send({ comments: comments });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { body, username } = request.body;
  if (!body || !username) {
    next({
      status: 400,
      msg: "Malformed body/missing required fields",
    });
  }
  const articlePromise = fetchArticlesById(article_id);
  articlePromise.then(() => {
    insertCommentByArticleId(article_id, body, username)
      .then((comment) => {
        response.status(201).send({ comment: comment });
      })
      .catch((err) => {
        next(err);
      });
  }).catch((err) => {
    next(err);
  });
};

module.exports = {
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
};
