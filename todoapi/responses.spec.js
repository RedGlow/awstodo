'use strict';

const assert = require('assert');
const responses = require('./responses');

describe('responses', () => {
    describe('#getTodosTransformer', () => {
        it('Produce a correct right answer', () =>
            responses.getTodosTransformer(Promise.resolve(["a", "b", "c"])).then(response => {
                assert.equal(response.statusCode, 200);
                assert.equal(response.headers['Content-Type'], 'application/json');
                assert.deepEqual(JSON.parse(response.body), ["a", "b", "c"]);
            })
        );
        it('Produce a correct failing answer', () =>
            responses.getTodosTransformer(Promise.reject(new Error("DB error"))).then(response => {
                assert.equal(response.statusCode, 500);
                assert.equal(response.headers['Content-Type'], 'application/json');
                assert.deepEqual(JSON.parse(response.body), "DB error");
            })
        );
    });
});