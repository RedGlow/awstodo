'use strict';

const todos = require('./todos');
const ptoc = require('./ptoc');

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.getTodos = ptoc((event, context) =>
  todos.getTodos(0).then(result => ({
    statusCode: 200,
    body: JSON.stringify(result)
  }))
  );