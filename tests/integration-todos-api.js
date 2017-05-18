'use strict';

const assert = require('assert');
const fetch = require('isomorphic-fetch');
const aws = require('aws-sdk');
const lib = require('./lib');
const waitRepeat = lib.waitRepeat;
const statusAndMethod = lib.statusAndMethod;

aws.config.update({ region: 'eu-central-1' });
var apigateway = new aws.APIGateway();

const apiEndpointPromise = new Promise((resolve, reject) =>
    apigateway.getRestApis({ limit: 0 }, (err, data) =>
        err ?
            reject(err) :
            resolve('https://' + data.items.find(e => e.name == 'dev-awstodoapi').id + '.execute-api.eu-central-1.amazonaws.com/dev')
    )
);

describe('API', () => {
    it('gets an empty list of todo for special user', () =>
        apiEndpointPromise
            .then(endpoint => statusAndMethod(fetch(endpoint + '/todos'), 'json'))
            .then(answer => {
                const s = `Wrong response ${answer.status} with status text "${answer.statusText}" and body ${JSON.stringify(answer.result)}`
                assert.equal(answer.status, 200, s);
                assert.equal(answer.result instanceof Array, true, s);
                assert.equal(answer.result.length, 0, s);
            })
    );

    it('can create and remove a todo for special user', () =>
        apiEndpointPromise.then(endpoint =>
            // create todo
            statusAndMethod(fetch(endpoint + '/todos', {
                method: "POST",
                body: JSON.stringify({
                    title: "the title",
                    content: "the content"
                })
            }), 'json').then(answer => {
                const s = `Wrong response ${answer.status} with status text "${answer.statusText}" and body ${JSON.stringify(answer.result)}`
                assert.equal(answer.status, 201, s);
                assert.equal(answer.result.todo.indexOf(endpoint + '/todos') == 0, true, s);
                const timestamp = parseInt(answer.result.todo.slice((endpoint + '/todos').length + 1));
                return timestamp;
            }).then(timestamp => waitRepeat(
                // check there's just that one todo
                () => statusAndMethod(fetch(endpoint + "/todos"), 'json').then(answer => {
                    const s = `Wrong response ${answer.status} with status text "${answer.statusText}" and body ${JSON.stringify(answer.result)}`
                    assert.equal(answer.status, 200, s);
                    assert.equal(answer.result instanceof Array, true, s);
                    assert.equal(answer.result.length, 1, s);
                    assert.equal(answer.result[0].username, "RedGlow", s);
                    assert.equal(answer.result[0].title, "the title", s);
                    assert.equal(answer.result[0].content, "the content", s);
                    assert.equal(answer.result[0].timestamp, timestamp, s);
                    return timestamp;
                })
                // delete the todo
            )).then(timestamp => statusAndMethod(fetch(endpoint + "/todos/" + timestamp.toString(), {
                method: "DELETE"
            }), 'text').then(answer => {
                const s = `Wrong response ${answer.status} with status text "${answer.statusText}" and body ${JSON.stringify(answer.result)}`
                assert.equal(answer.status, 204, s);
                assert.equal(answer.result, "", s);
            }).then(() => waitRepeat(
                // check there's no todo
                () => statusAndMethod(fetch(endpoint + "/todos"), 'json').then(answer => {
                    const s = `Wrong response ${answer.status} with status text "${answer.statusText}" and body ${JSON.stringify(answer.result)}`
                    assert.equal(answer.status, 200, s);
                    assert.equal(answer.result instanceof Array, true, s);
                    assert.equal(answer.result.length, 0, s);
                })
            )))
        )
    ).timeout(5000);
});