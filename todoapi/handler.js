'use strict';

const ptoc = require('./promisetocallback');
const responses = require('./responses');
const todos = require('./todos');

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

module.exports.getTodos = ptoc(event =>
  responses.getTodosTransformer(todos.getTodos(event.stageVariables.todos_table, "RedGlow"))
);

module.exports.addTodo = ptoc(event =>
  new Promise(resolve => resolve(JSON.parse(event.body)))
    .then(data => responses.addTodoTransformer(
      todos.addTodo(event.stageVariables.todos_table, "RedGlow", data.title, data.content),
      event))
);

module.exports.removeTodo = ptoc(event =>
  responses.removeTodoTransformer(
    todos.removeTodo(
      event.stageVariables.todos_table,
      "RedGlow",
      parseInt(event.pathParameters.timestamp))
  )
);