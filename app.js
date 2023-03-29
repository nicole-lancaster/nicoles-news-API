const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers.js");
const {
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");
const {
  badUrlHandling,
  customErrorMiddleware,
  handlePsqlErrorsMiddleware,
} = require("./controllers/error.controllers.js");

app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.use(customErrorMiddleware);
app.use(handlePsqlErrorsMiddleware);

app.all("/*", badUrlHandling);

module.exports = app;
