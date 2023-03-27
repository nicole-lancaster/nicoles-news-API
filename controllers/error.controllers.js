const customErrorHandling = (request, response) => {
  response.status(404).send({ msg: "Invalid file path" });
};

module.exports = { customErrorHandling };
