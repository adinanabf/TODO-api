const PORT = process.env.PORT || 8080;

const app = require('./app')

require('./src/db/mongoose')

app.listen(PORT, () => {
    console.log(`Running server on port ${PORT}.`);
});