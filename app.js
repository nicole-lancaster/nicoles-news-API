const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers.js");
const { getArticlesById } = require("./controllers/articles.controller");
const { badUrlHandling } = require("./controllers/error.controllers.js");

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);

app.all("/*", badUrlHandling);

module.exports = app;
