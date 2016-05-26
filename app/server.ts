/// <reference path="./typings/index.d.ts" />
"use strict";
var bodyParser = require('body-parser');
var cors = require('./middleware/cors.js');
var express = require('express');

// API
var conversationController = require('./api/conversation/conversationController.js');
var messageController = require('./api/message/messageController.js');

// APP
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PORT = process.env.PORT || 9000;

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw());
app.use(bodyParser.text());

// CHAT SERVICE
var Chat = require('./services/chatService.js');
var chat = new Chat(io);
chat.init();

app.get('/script/:businessId', (req, res) => {
  var path = __dirname + '/test.js';
  var chindow = require('./services/chindow.js');
  chindow(req.params.businessId, (file) => {
    return res.send(file);
  });
});

// ROUTERS
app.use('/message', messageController);
app.use('/conversation', conversationController)

app.get('/', (req, res) => {
  res.send('Howdie andrew Dylan!!');
});

app.get('/slack', (req, res) => {
  let slack = require('./microservices/slack');
  slack();
  res.send(200);
});

var slack = require('./microservices/slack');
slack();

server.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});
