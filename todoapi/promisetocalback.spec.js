const assert = require('assert');
const ptoc = require('./promisetocallback');

describe('promisetocallback', () => {
    const getContext = () => {
        var context = {
            called: false
        }
        var doResolvePromise = null;
        context.finishedPromise = new Promise((resolve, reject) => {
            doResolvePromise = resolve;
        });
        context.callback = (err, res) => {
            context.called = true;
            context.error = err;
            context.result = res;
            doResolvePromise();
        }

        return context;
    }

    it('can wrap a successful callback system.', () => {
        const context = getContext();
        const wrappedPromiseFunction = ptoc((event, context) => Promise.resolve(33));
        assert.equal(context.called, false);
        wrappedPromiseFunction('event', {}, context.callback);
        return context.finishedPromise.then(() => {
            assert.equal(context.called, true);
            assert.equal(context.error, null);
            assert.equal(context.result, 33);
        });
    });

    it('can wrap a failed callback system', () => {
        const context = getContext();
        const wrappedPromiseFunction = ptoc((event, context) => Promise.reject(new Error("33")));
        assert.equal(context.called, false);
        wrappedPromiseFunction('event', {}, context.callback);
        return context.finishedPromise.then(() => {
            assert.equal(context.called, true);
            assert.equal(context.error instanceof Error, true);
            assert.equal(context.error.message, "33");
            assert.equal(context.result, null);
            return Promise.resolve("ok");
        });
    });
});