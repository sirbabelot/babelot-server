/// <reference path="./typings/node.d.ts" />
"use strict";
// To allow relative requires in other modules
global.__base = __dirname + '/';
require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('./middleware/cors.js');
var request = require('superagent');


/* routers */
var userController = require('./api/user/userController.js');

/* app */
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, { path: '/babelot/socket.io' });
var PORT = process.env.PORT || 8080;

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.raw());
app.use(bodyParser.text());

// Start up the chat service
let ChatService = require('./services/chatService.js');
let chatService = new ChatService(io);
chatService.init();

app.get('/script/:businessId', (req, res)=> {
  var path = __dirname + '/test.js';
  var chindow = require('./services/chindow.js');
  chindow(req.params.businessId, (file) => {
    return res.send(file);
  });
});

// ROUTERS
app.use('/users', userController);
// Semantic analysis data
app.post('/tone', (req, res) => {
  var text = JSON.parse(req.body).text
  request.post('https://babelot-ibm.mybluemix.net/tone')
    .send({ text: text })
    .end((err, data) => {
      res.send(data)
    });
})

server.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});
