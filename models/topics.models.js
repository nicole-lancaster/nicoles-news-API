const db = require("../db/connection.js");

const fetchTopics = () => {
  return db
    .query(`SELECT * FROM topics;`)
    .then((topics) => {
      return topics.rows;
    })
    .catch(() => {
      console.log("error retrieving topics");
    });
};

module.exports = { fetchTopics };
