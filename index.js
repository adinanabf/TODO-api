const express = require("express");
const PORT = 8080;

const app = express();

app.use(express.json());

const routes = require("./src/routes/routes");

require('./src/db/mongoose')

app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}.`);
});