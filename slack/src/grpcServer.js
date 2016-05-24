var path = require('path');
var grpc = require('grpc');
var dispatch = require('./dispatch.js');

var exec = require('child_process').exec;
var PROTO_PATH = __dirname + path.resolve(__dirname, '/../../protos/slack.proto');
var slack = grpc.load(PROTO_PATH).slack;

/**
 * Starts an RPC server that receives requests for the Dispatch service
 */
function main() {
  var server = new grpc.Server();
  server.addProtoService(slack.Dispatch.service, {
    sendMessage: dispatch.sendMessage,
    createChannel: dispatch.createChannel
  });
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
