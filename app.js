const express = require("express");
require("express-async-errors");
const routes = require("./src/routes/routes");
const app = express();

require('./src/db/mongoose')
require('./src/db/postgres');

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "This is the TODO API, a RESTful API that allows users to manage their to-do lists.",
  });
});

app.use("/api", routes);

app.use((err, _, res, __) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

module.exports = app;
