const db = require("../db/connection.js");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    if (!topics.rows.length) {
      return Promise.reject({ status: 404, msg: "Invalid file path" });
    }
    return topics.rows;
  });
};

module.exports = { fetchTopics };
