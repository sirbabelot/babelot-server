/**
 * This file creates a grpc server which can receive RPC calls. It configers and
 *     makes available grpc services.
 */
var path = require('path');
var grpc = require('grpc');
var dispatch = require('./dispatch.js');

const PORT = 50052;
var PROTO_PATH = __dirname + path.resolve(__dirname, '/localprotos/messages.proto');
var messages = grpc.load(PROTO_PATH).messages;


var server = new grpc.Server();

server.addProtoService(messages.Dispatch.service, {
  startConversation: dispatch.startConversation
});

server.bind(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure());
server.start();
console.log('Server started on', PORT);
