const badUrlHandling = (request, response) => {
  response.status(404).send({ msg: "Invalid URL" });
};

const customErrorMiddleware = (err, request, response, next) => {
  const { status, msg } = err;

  if (status && msg) {
    response.status(status).send({ msg });
  } else next(err);
};

module.exports = { badUrlHandling, customErrorMiddleware };
