const express = require('express');
const usersRouter = require('./users/userRouter');
const server = express();

// global middleware
server.use(express.json());

server.use('/users', logger, usersRouter);

server.get('/', async (req, res) => {
  try{
    const messageOfTheDay = process.env.MOTD || 'Hello World!';
    res.status(200).json({motd: messageOfTheDay});
  }catch (error){
    console.error('\nERROR', error);
    res.status(500).json({ error: 'Cannot retrieve the shoutouts' });
  }

});

//custom middleware

function logger(req, res, next) {
  console.log(`API ${req.method} trying to connect to ${req.url} at [${new Date().toISOString()}] `);
  next()
}

module.exports = server;
