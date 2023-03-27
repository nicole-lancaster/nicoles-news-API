const badUrlHandling = (request, response) => {
  response.status(404).send({ msg: "Invalid URL" });
};

module.exports = { badUrlHandling };
