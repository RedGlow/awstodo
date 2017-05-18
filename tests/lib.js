const delayPromise = delay => new Promise((resolve) => setTimeout(resolve, delay));

const waitRepeat = (promiseFunction, delay = 250, numRepeats = 8) => {
    return promiseFunction()
        .catch(e => numRepeats <= 0 ?
            Promise.reject(e) :
            delayPromise(delay).then(() => waitRepeat(promiseFunction, delay, numRepeats - 1)));
};

module.exports.waitRepeat = waitRepeat;

/**
 * @return {Promise<{status: number, statusText: string, result: any}>}
 */
module.exports.statusAndMethod = (fetchPromise, methodName) => {
    return fetchPromise.then(response =>
        response[methodName]().then(content => ({
            status: response.status,
            statusText: response.statusText,
            result: content
        })));
}