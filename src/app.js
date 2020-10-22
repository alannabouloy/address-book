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
app.use(express.json());

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
    //set request to appropriate variables
    const {firstName, lastName, address1, address2=false, city, state, zip}= req.body;
    
    //VALIDATION
    //check if first name
    if(!firstName){
        res
            .status(400)
            .send('address must include a first name')
    }
    //check if last name
    if(!lastName){
        res
            .status(400)
            .send('address must include a last name')
    }
    //check if address1
    if(!address1){
        res
            .status(400)
            .send('address must include an address1 line')
    }
    //check if city
    if(!city){
        res
            .status(400)
            .send('address must include a city')
    }
    //check if state
    if(!state){
        res
            .status(400)
            .send('address must include a state')
    }
    //check if zip
    if(!zip){
        res
            .status(400)
            .send('address must include a zip')
    }
    //check if state is 2 characters
    if(state.length !== 2) {
        res
            .status(400)
            .send('state must have exactly 2 characters')
    }
    //check if zip is a number
    if(isNaN(zip)){
        res
            .status(400)
            .send('zip must be a number')
    }
    //check is zip is 5 digits
    if(zip.toString().length !== 5){
        res
            .status(400)
            .send('zip must be 5 digits long')
    }

    res.send('Posted');
    
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