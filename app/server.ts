/// <reference path="./typings/node.d.ts" />
"use strict";
require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('./middleware/cors.js');
var request = require('superagent');


/* routers */
var userController = require('./api/user/userController.js');

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
app.use('/users', userController);

app.get('/', (req, res)=> {
  res.send('Howdie ho!!')
})

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
