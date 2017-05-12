'use strict';

const assert = require('assert');
const fetch = require('isomorphic-fetch');
const aws = require('aws-sdk');

aws.config.update({ region: 'eu-central-1' });
var apigateway = new aws.APIGateway();

const apiEndpointPromise = new Promise((resolve, reject) =>
    apigateway.getRestApis({limit: 0}, (err, data) =>
        err ?
            reject(err) :
            resolve('https://' + data.items.find(e => e.name == 'dev-awstodoapi').id + '.execute-api.eu-central-1.amazonaws.com/dev')
    )
);

describe('API', () => {
    it('gets an empty list of todo for special user', () =>
        apiEndpointPromise
            .then(endpoint => fetch(endpoint + '/todos'))
            .then(response => {
                assert.equal(response.status, 200, `Wrong response status ${response.status} with status text "${response.statusText}"`);
                return response.json();
            })
            .then(result => {
                assert.equal(result instanceof Array, true, `${JSON.stringify(result)} is not an array`);
                assert.equal(result.length, 0);
            })
    );
});