const users = require("../db/data/test-data/users");
const { fetchUsers } = require("../models/users.models");

const getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      return response.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers };