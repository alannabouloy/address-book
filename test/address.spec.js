const { expect } = require("chai")
const supertest = require("supertest")

const app = require('../src/app');

describe('GET /address endpoint', () => {
    it('returns a status of 200 and an array of address objects', () => {
        return supertest(app)
            .get('/address')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                //checks that the response is an array
                expect(res.body).to.be.an('array');
                //checks that the response array is not empty
                expect(res.body).to.have.lengthOf.at.least(1);
                //checks that the response array objects have correct keys
                for(let i = 0; i < res.body.length; i++){
                    expect(res.body[i]).to.have.all.keys('firstName', 'lastName', 'address1', 'address2', 'city', 'state', 'zip', 'id');
                }  
            });
    });
});