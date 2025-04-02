const express = require("express");
require("express-async-errors");
const routes = require("./routes/routes");
const app = express();
require("dotenv").config();

require("./db/mongoose");
require("./db/postgres");

app.use(express.json());

app.get("/", (__, res) => {
  res.status(200).json({
    message:
      "This is the TODO API, a RESTful API that allows users to manage their to-do lists.",
  });
});

app.use("/api", routes);

app.use((err, _, res, __) => {
  console.error(err);
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
