//dependencies
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const {v4: uuid} = require('uuid');

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

//Bearer Token Validator
function validateBearerToken(req, res, next){
    //get api token from .env file
    const apiToken = process.env.API_TOKEN;
    //get authorization header from api request
    const authToken = req.get('Authorization');

    //validate there was an authorization header and it matches api token
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res
            .status(401)
            .json({error: 'Unauthorized request'})
    }

    next();
}

//GET address endpoint
function handleGetAddress(req, res){
    res
        .status(200)
        .json(addresses);
}
app.get('/address', handleGetAddress);

//POST address endpoint
function handlesPostAddress(req, res) {
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

    const id = uuid();

    addresses.push(
        {
            id,
            firstName,
            lastName,
            address1,
            address2,
            city,
            state,
            zip
        }
    );

    const index = addresses.findIndex(curr => curr.id == id);

    res
        .status(201)
        .send(addresses[index]);
    
}
app.post('/address', validateBearerToken, handlesPostAddress);

//DELETE /address endpoint
function handleDeleteAddress(req, res) {
    const { addressId } = req.params;

    console.log(addressId);

    //validate id
    const index = addresses.findIndex(curr => curr.id === addressId);
    if(index === -1){
        return res
            .status(404)
            .send('Address not found')
    }

    //delete address
    addresses.splice(index, 1);

    //send response
    res
        .status(204)
        .end();

}
app.delete('/address/:addressId', validateBearerToken, handleDeleteAddress);


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