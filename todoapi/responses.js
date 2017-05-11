'use strict';

/**
 * Get a JSON response following the AWS Lambda / API Gateway protocol.
 * 
 * @param {number} status       The status code
 * @param {any}    value        The content of the response
 */
const getJSONResponse = (status, value) => ({
    statusCode: status,
    body: JSON.stringify(value),
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * @param   {Promise<any[]>} todosPromise     A promise containing the list of todos, or an error
 * @returns {Promise<{statusCode: number, body: string, headers: any}>}     A promise containing the respones
 */
module.exports.getTodosTransformer = todosPromise =>
    todosPromise.then(
        result => getJSONResponse(200, result)
    ).catch(
        error => getJSONResponse(500, error.message)
    );