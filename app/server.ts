/// <reference path="./typings/index.d.ts" />
'use strict';
var bodyParser = require('body-parser');
var cors = require('./middleware/cors.js');
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
// Controllers
var conversationController = require('./api/conversation/conversationController.js');
var messageController = require('./api/message/messageController.js');


const PORT = process.env.PORT || 9000;
var app = express();
var server = http.Server(app);
var io = socketio(server);

// Middleware
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
// Routers
app.use('/message', messageController);
app.use('/conversation', conversationController);

// Chat Service
var Chat = require('./services/chatService.js');
var chat = new Chat(io);
chat.init();

/**
 * Returns status codes for each subsystem
 * TODO (dharness): statuses aside from api are
 *   hardcoded right now until mechanisms can
 *   be put in place to properly check their status
 */
app.get('/status', (req, res) => {
  let status = {
    api: 200,
    chindow: 400,
    slack: 400,
    chatterpiller: 400
  };
  res.send(status);
});

server.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});

