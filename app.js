const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers.js");
const { customErrorHandling } = require("./controllers/error.controllers.js");

app.get("/api/topics", getTopics);
app.all("/*", customErrorHandling);

module.exports = app;
