/*const assert = require('assert');
const handler = require('./handler');

describe('handler', () => {
    describe('#getTodos', () => {
        it('Should return a response with an empty JSON list.', (done) => {
            handler.getTodos('event', {}, (err, response) => {
                try {
                    assert.equal(err, null);
                    assert.equal(response.statusCode, 200);
                    assert.deepEqual(JSON.parse(response.body), []);
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });
    });
});*/

// to be refactored / tested through integration