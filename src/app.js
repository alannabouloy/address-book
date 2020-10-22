//dependencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const uuid = require('uuid');

//set up the app
const app = express();

//basic setup of morgan, helmet, and cors
const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//test endpoint
app.get('/test', (req, res) => {
    res.send('Hello, world!')
});

//addresses
const addresses = [
    {
        "id": "1",
        "firstName": "Johnny",
        "lastName": "Test",
        "address1": "Apartment B",
        "address2": "221 Baker Street",
        "city": "London",
        "state": "MA",
        "zip" : 32453

    }
]
//GET address endpoint
app.get('/address', (req, res) => {
    res
        .status(200)
        .json(addresses);
});

//POST address endpoint
app.post('/address', (req, res) => {
    
})

//error handler
app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

//export statement
module.exports = app