"use strict";
var grpc = require('grpc');
var path = require('path');


var PROTO_PATH = path.resolve(__dirname, '../protos/messages.proto');
console.log(PROTO_PATH);
var messages = grpc.load(PROTO_PATH).messages;
var dispatch = new messages.Dispatch('192.168.99.100:50052', grpc.credentials.createInsecure());

var message = {
  nickname: 'nick_name',
  fromFingerprint: 'f_f',
  roomId: 'room_id',
  body: 'body__'
};

var stream = dispatch.sendMessage(message);
setInterval(() => {
  stream.write(message);
}, 1000)

stream.on('data', (response) => {
  console.log(response);
});



