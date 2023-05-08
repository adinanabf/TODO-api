require('dotenv').config();
const mongoose = require('mongoose');
const DB_URL = process.env.DATABASE_URL;
const DB_NAME = process.env.DATABASE_NAME;

mongoose.connect(DB_URL+DB_NAME, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const database = mongoose.connection;

database.on('error', (error) => {console.log('Unable to connect to database.', error)});
database.once('connected', () => {console.log('Database connected.')});
