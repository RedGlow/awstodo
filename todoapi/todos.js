'use strict';

var aws = require('aws-sdk');

aws.config.update({region: 'eu-central-1'});

const dynamodb = new aws.DynamoDB();

/*
 * Schema:
 * username [partition key]: {username}
 * timestamp [sort key]: {timestamp}
 */

/**
 * Get the list of todos for given username.
 * 
 * @param {string} username     The username to check.
 * @return {Promise<any[]>}     A promise containing the list of todos.
 */
module.exports.getTodos = (username) => new Promise((resolve, reject) => dynamodb.query({
    TableName: "TodosTest",
    KeyConditionExpression: "username = :un",
    ProjectionExpression: "username",
    ExpressionAttributeValues: {
        ":un": {
            S: username
        }
    }
}, (err, data) => err ? reject(err) : resolve(data.Items)
));

module.exports.addTodo = (userId, todo) => Promise.resolve();

module.exports.removeTodo = (userId, todoId) => Promise.resolve();