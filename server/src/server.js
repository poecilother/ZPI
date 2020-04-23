const app = require('./app');

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on ${server.address().port}`);
});
