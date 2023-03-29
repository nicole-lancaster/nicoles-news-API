const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers.js");
const { getArticlesById, getAllArticles } = require("./controllers/articles.controllers");
const {
  badUrlHandling,
  customErrorMiddleware,
  handlePsqlErrorsMiddleware,
} = require("./controllers/error.controllers.js");

app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticlesById);

app.use(customErrorMiddleware);
app.use(handlePsqlErrorsMiddleware);

app.all("/*", badUrlHandling);

module.exports = app;
