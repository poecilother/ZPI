const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION_URI,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true
});

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users'));


module.exports = app;
