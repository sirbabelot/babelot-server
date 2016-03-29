"use strict";
global.__base = __dirname + '/';
require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('./middleware/cors.js');
var request = require('superagent');
var userController = require('./api/user/userController.js');
var connectionController = require('./api/connection/connectionController.js');
var tokenController = require('./api/token/tokenController.js');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server, { path: '/babelot/socket.io' });
var PORT = process.env.PORT || 8080;
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
let ChatService = require('./services/chatService.js');
let chatService = new ChatService(io);
chatService.init();
app.use('/users', userController);
app.use('/connection', connectionController);
app.use('/token', tokenController);
app.post('/tone', (req, res) => {
    var text = JSON.parse(req.body).text;
    request.post('https://babelot-ibm.mybluemix.net/tone')
        .send({ text: text })
        .end((err, data) => {
        res.send(data);
    });
});
server.listen(PORT, () => {
    console.log(`Server listening at https://localhost:${PORT}`);
});