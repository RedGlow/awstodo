'use strict';

const assert = require('assert');
const moment = require('moment');
const aws = require('aws-sdk');
const todos = require('../todoapi/todos');
const waitRepeat = require('./lib').waitRepeat;
aws.config.update({ region: 'eu-central-1' });

const dynamodb = new aws.DynamoDB();

describe('todos', () => {
    const emptyDb = () => new Promise((resolve, reject) => dynamodb.scan({
        TableName: "todos-dev",
        ExpressionAttributeNames: {
            "#UN": "username",
            "#TS": "timestamp"
        },
        ProjectionExpression: "#UN, #TS"
    }, (err, result) => err ? reject(err) : result.Items.length == 0 ? resolve() : dynamodb.batchWriteItem({
        RequestItems: {
            "todos-dev": result.Items.map(entry => ({
                DeleteRequest: {
                    Key: {
                        username: entry.username,
                        timestamp: entry.timestamp
                    }
                }
            }))
        }
    }, (err, result) => err ? reject(err) : resolve()))
    );

    it('gets no todo if the DB is empty', () => {
        // empty the DB
        return emptyDb().then(() => todos.getTodos("todos-dev", "RedGlow").then(result => {
            assert.equal(result.length, 0);
        }));
    });

    it('gets one todo after it is added', () => {
        var beforeTimestamp = null;
        return emptyDb()
            .then(() => {
                beforeTimestamp = moment.utc().valueOf();
                return todos.addTodo("todos-dev", "RedGlow", "Title", "Content")
            })
            .then(timestamp => {
                var afterTimestamp = moment.utc().valueOf();
                assert.equal(beforeTimestamp <= timestamp, true, `We should have beforeTimestamp (${beforeTimestamp}) <= timestamp (${timestamp}), but it is not true.`);
                assert.equal(timestamp <= afterTimestamp, true, `We should have timestamp (${timestamp}) <= afterTimestamp (${afterTimestamp}), but it is not true.`);
                return waitRepeat(() => todos.getTodos("todos-dev", "RedGlow").then(result => {
                    assert.equal(result.length, 1);
                    var entry = result[0];
                    assert.equal(entry.username, "RedGlow");
                    assert.equal(entry.title, "Title");
                    assert.equal(entry.content, "Content");
                    assert.equal(entry.timestamp, timestamp);
                    assert.equal(entry.timestamp < moment.utc().valueOf(), true, `not true that ${entry.timestamp} < ${moment.utc().valueOf()}`);
                }));
            });
    });

    it('gets no todos after one is added and consequently removed', () => {
        return emptyDb()
            .then(() => todos.addTodo("todos-dev", "RedGlow", "Title", "Content"))
            .then(() => waitRepeat(() => todos.getTodos("todos-dev", "RedGlow").then(result => {
                assert.equal(result.length, 1);
                return todos.removeTodo("todos-dev", "RedGlow", result[0].timestamp).then(() =>
                    waitRepeat(() => todos.getTodos("todos-dev", "RedGlow").then(result => {
                        assert.equal(result.length, 0);
                    }))
                );
            })))
    });
});