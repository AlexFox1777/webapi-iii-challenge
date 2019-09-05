const express = require('express');
const usersRouter = require('./users/userRouter');
const server = express();

// global middleware
server.use(express.json());

server.use('/users', logger, usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`API ${req.method} trying to connect to ${req.url} at [${new Date().toISOString()}] `);
  next()
}

module.exports = server;
