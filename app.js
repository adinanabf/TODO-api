const express = require('express');

const routes = require('./src/routes/routes');

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "This is the TODO API, a RESTful API that allows users to manage their to-do lists." 
  });
});

app.use('/api', routes);

module.exports = app;