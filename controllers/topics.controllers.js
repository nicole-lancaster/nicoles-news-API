const topics = require("../db/data/test-data/topics.js");
const { fetchTopics } = require("../models/topics.models.js");

const getTopics = (request, response) => {
  fetchTopics().then(topics);
  response
    .status(200)
    .send({ topics: topics })
};

module.exports = { getTopics };
