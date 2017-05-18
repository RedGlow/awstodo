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

    describe('#addTodoTransformer', () => {
        it('Produce a correct right answer', () =>
            responses.addTodoTransformer(
                Promise.resolve(1234),
                {
                    headers: {
                        "X-Forwarded-Proto": "https",
                        "Host": "testhost"
                    },
                    requestContext: {
                        stage: "dev"
                    }
                })
                .then(response => {
                    assert.equal(response.statusCode, 201, `Wrong response code ${response.statusCode} with body ${response.body}.`);
                    assert.equal(response.headers['Content-Type'], 'application/json');
                    assert.deepEqual(JSON.parse(response.body), {
                        todo: "https://testhost/dev/todos/1234"
                    });
                })
        );
        it('Produce a correct failing answer', () =>
            responses.addTodoTransformer(Promise.reject(new Error("DB error"))).then(response => {
                assert.equal(response.statusCode, 500);
                assert.equal(response.headers['Content-Type'], 'application/json');
                assert.deepEqual(JSON.parse(response.body), "DB error");
            })
        );
    });

    describe('#removeTodoTrasformer', () => {
        it('Produce a correct right answer', () => {
            responses.removeTodoTransformer(Promise.resolve()).then(response => {
                assert.equal(response.statusCode, 204);
                assert.equal(response.headers['Content-Type'], 'application/json');
                assert.equal(response.body, "");
            })
        });
        it("Produce a correct failing answer", () =>
            responses.removeTodoTransformer(Promise.reject(new Error("DB error"))).then(response => {
                assert.equal(response.statusCode, 500);
                assert.equal(response.headers['Content-Type'], 'application/json');
                assert.deepEqual(JSON.parse(response.body), "DB error");
            })
        );
    });
});