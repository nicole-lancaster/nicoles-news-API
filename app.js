const express = require("express");
const cors = require("cors");
const app = express();
const { getAllEndpoints } = require("./controllers/api.controller.js");
const { getTopics } = require("./controllers/topics.controllers.js");
const { getUsers } = require("./controllers/users.controllers.js");
const {
  getArticlesById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteCommentById,
} = require("./controllers/articles.controllers");
const {
  badUrlHandling,
  customErrorMiddleware,
  handlePsqlErrorsMiddleware,
} = require("./controllers/error.controllers.js");

app.use(express.json());
app.use(cors());

app.get("/api", getAllEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.get("/api/users", getUsers);

app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", badUrlHandling);
app.use(customErrorMiddleware);
app.use(handlePsqlErrorsMiddleware);

module.exports = app;
