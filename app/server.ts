/// <reference path="./typings/index.d.ts" />
"use strict";
var bodyParser = require('body-parser');
var cors = require('./middleware/cors.js');
var express = require('express');
var request = require('superagent');


/* routers */
var conversationController = require('./api/conversation/conversationController.js');
var messageController = require('./api/message/messageController.js');

/* app */
var app = express();
var request = require("request");
var server = require('http').Server(app);
var io = require('socket.io')(server);
var PORT = process.env.PORT || 9000;

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
app.use('/message', messageController);
app.use('/conversation', conversationController)

app.get('/', (req, res) => {
  res.send('Howdie andrew Dylan!!');
});

app.get('/slack', (req, res)=> {
  let slack = require('./microservices/slack');
  slack();
  res.send(200);
});

var slack = require('./microservices/slack');
slack();

// Semantic analysis data
app.post('/tone', (req, res) => {
  console.log(req.body);
  if (req.body && typeof req.body !== typeof {}) {
    var text = JSON.parse(req.body).text;

    var options = {
      method: 'POST',
      url: 'https://gateway.watsonplatform.net/tone-analyzer-beta/api/v3/tone',
      qs: { version: '2016-02-11', sentences: 'false' },
      headers:
      {
        'postman-token': 'e30b55f6-0724-5620-2435-ef59218c182f',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        authorization: 'Basic YTEyODlkZDYtN2UzYi00YjcyLWE4NmUtMmJlMmIyMTNkNWMxOlhEVVRobG1CRlpUVg=='
      },
      body: { text },
      json: true
    };

    return request(options, function(error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      res.send(body);
    });
  }

  res.send(422);

})

server.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});
