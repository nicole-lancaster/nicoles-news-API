const db = require("../db/connection.js");

const fetchUsers = () => {
  return db
    .query(`SELECT * FROM users;`)
    .then((users) => {
      return users.rows;
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { fetchUsers };
