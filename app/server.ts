/// <reference path="./typings/index.d.ts" />
'use strict';
require('app-module-path').addPath(__dirname);
var Chat = require('services/chatService.js');
var conversationController = require('api/conversation/conversationController.js');
var cors = require('middleware/cors.js');
var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');

const PORT = process.env.PORT || 9000;
var app = express();
var server = http.Server(app);
var io = socketio(server);

// Middleware
app.use(cors);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.'));

// Routers
app.use('/conversation', conversationController);

// Chat Service
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
    // If you can access this route, API is working
    api: 200,
    chindow: 400,
    slack: 400,
    chatterpiller: 400,
    BABLOT_API_URL: process.env.BABLOT_API_URL
  };
  res.render('./status', status);
});

server.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});

