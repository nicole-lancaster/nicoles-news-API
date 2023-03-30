const badUrlHandling = (request, response) => {
  response.status(404).send({ msg: "Invalid URL" });
};

const customErrorMiddleware = (err, request, response, next) => {
  const { status, msg } = err;

  if (status && msg) {
    response.status(status).send({ msg });
  } else next(err);
};

const handlePsqlErrorsMiddleware = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "22003") {
    res
      .status(400)
      .send({ msg: "Out of range for type integer - choose a smaller number" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Foreign key constraint" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: `Malformed body/missing required fields` });
  } else next(err);
};

module.exports = {
  badUrlHandling,
  customErrorMiddleware,
  handlePsqlErrorsMiddleware,
};
