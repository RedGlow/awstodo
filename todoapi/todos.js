'use strict';

const aws = require('aws-sdk');
const moment = require('moment');

aws.config.update({ region: 'eu-central-1' });

const dynamodb = new aws.DynamoDB();

/**
 * Get the list of todos for given username.
 * 
 * @param {string} username     The username to check.
 * @return {Promise<any[]>}     A promise containing the list of todos.
 */
module.exports.getTodos = (username) => new Promise((resolve, reject) => dynamodb.query({
    TableName: "TodosTest",
    KeyConditionExpression: "username = :un",
    ProjectionExpression: "username,title,content,#TS",
    ExpressionAttributeValues: {
        ":un": {
            S: username
        }
    },
    ExpressionAttributeNames: {
        "#TS": "timestamp"
    }
}, (err, data) => err ? reject(err) : resolve(data.Items.map(item => ({
    username: item.username.S,
    title: item.title.S,
    content: item.content.S,
    timestamp: parseInt(item.timestamp.N)
})))
));

/**
 * Add a new TODO.
 * 
 * @param   {string} username
 * @param   {string} title
 * @param   {string} content
 * @return  {Promise}
 */
module.exports.addTodo = (username, title, content) => new Promise((resolve, reject) => {
    dynamodb.putItem({
        TableName: "TodosTest",
        Item: {
            username: { S: username },
            timestamp: { N: moment.utc().valueOf().toString() },
            title: { S: title },
            content: { S: content }
        }
    }, (err, data) => err ? reject(err) : resolve());
});

/**
 * Remove a TODO.
 * 
 * @param   {string} username
 * @param   {moment} timestamp
 */
module.exports.removeTodo = (username, timestamp) => new Promise((resolve, reject) => {
    dynamodb.deleteItem({
        Key: {
            "username": {
                S: username
            },
            "timestamp": {
                N: timestamp.toString()
            }
        },
        TableName: "TodosTest"
    }, (err, data) => err ? reject(err) : resolve());
});