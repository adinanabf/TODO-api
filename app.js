const express = require("express");

const routes = require("./src/routes/routes");
const AppError = require("./src/error/AppError");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "This is the TODO API, a RESTful API that allows users to manage their to-do lists.",
  });
});

app.use((err, _req, res, _next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
});

app.use("/api", routes);

module.exports = app;
