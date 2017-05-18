module.exports = (promiseFunction) => (
    (event, context, callback) => {
        try {
            return promiseFunction(event, context)
                .then(result => {
                    callback(null, result);
                })
                .catch(error => {
                    console.error("The promise failed:", JSON.stringify(error, null, 2));
                    callback(error, null);
                });
        } catch (e) {
            console.error("The promise function threw an exception:", JSON.stringify(e, null, 2));
            callback(e, null);
        }
    }
);