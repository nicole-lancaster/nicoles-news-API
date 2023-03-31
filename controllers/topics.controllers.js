const topics = require("../db/data/test-data/topics.js");
const { fetchTopics } = require("../models/topics.models.js");

const getTopics = (request, response, next) => {
  fetchTopics()
    .then((topics) => {
      return response.status(200).send({ topics: topics });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getTopics };
