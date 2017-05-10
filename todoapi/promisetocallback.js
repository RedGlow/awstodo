module.exports = (promiseFunction) => (
    (event, context, callback) =>
        promiseFunction(event, context)
            .then(result => callback(null, result))
            .catch(error => callback(error, null))
);