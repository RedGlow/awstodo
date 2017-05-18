'use strict';

/**
 * Get a JSON response following the AWS Lambda / API Gateway protocol.
 * 
 * @param {number} status       The status code
 * @param {any}    value        The content of the response
 */
const getJSONResponse = (status, value) => ({
    statusCode: status,
    body: value === undefined ? '' : JSON.stringify(value),
    headers: {
        'Content-Type': 'application/json'
    }
});

const produceBaseUrl = event =>
    event.headers["X-Forwarded-Proto"] +
    "://" +
    event.headers["Host"] +
    "/" +
    event.requestContext.stage;

/**
 * @param   {Promise<any[]>} todosPromise     A promise containing the list of todos, or an error
 * @returns {Promise<{statusCode: number, body: string, headers: any}>}     A promise containing the respones
 */
module.exports.getTodosTransformer = todosPromise =>
    todosPromise
        .then(result => getJSONResponse(200, result))
        .catch(error => getJSONResponse(500, error.message));

/**
 * @param   {Promise<number>} todosPromise     A promise resolving upon add completed, or an error
 * @returns {Promise<{statusCode: number, body: string, headers: any}>}     A promise containing the respones
 */
module.exports.addTodoTransformer = (todosPromise, event) =>
    todosPromise
        .then(timestamp => getJSONResponse(201, {
            todo: produceBaseUrl(event) + "/todos/" + timestamp.toString()
        }))
        .catch(error => getJSONResponse(500, error.message));

/**
 * @param   {Promise<void>} todosPromise     A promise resolving upon delete completed, or an error
 * @returns {Promise<{statusCode: number, body: string, headers: any}>}     A promise containing the responses
 */
module.exports.removeTodoTransformer = todosPromise =>
    todosPromise
        .then(() => getJSONResponse(204))
        .catch(error => getJSONResponse(500, error.message));