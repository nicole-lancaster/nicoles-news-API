const db = require("../db/connection.js");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};

module.exports = { fetchTopics };
