const assert = require('assert');
const todos = require('./todos');

describe('todos', () => {
    describe('#getTodos', () => {
        it('should return an empty list at startup.', () => {
            assert.deepStrictEqual(todos.getTodos(), []);
        });
    });
});