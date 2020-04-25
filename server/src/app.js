const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.MONGO_CONNECTION_URI,{
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true
});

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use('/users', require('./routes/users'));
app.use('/mail', require('./routes/mail'));



app.get('/', (req, res) => { res.send('CleanMail server') });


module.exports = app;
