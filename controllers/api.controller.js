const fs = require("fs/promises");

const getAllEndpoints = async (request, response, next) => {
  const data = await fs.readFile("endpoints.json")
    return response.status(200).send(data.toString())

};

module.exports = { getAllEndpoints };
