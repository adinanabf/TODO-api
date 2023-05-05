require('dotenv').config();

const express = require("express");
const PORT = 5000;
const routes = require("./routes/routes");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error)
})
database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(express.json())
// app.use(bodyParser.urlencoded({extended: true})); 

app.use("/api", routes);

app.listen(PORT, () => console.log(`Running server on port: ${PORT}`));