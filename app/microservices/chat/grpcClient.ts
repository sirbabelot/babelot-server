/**
 * @fileoverview This file is responsible for creating the remote connection
 *     with the chatterpiller service in the form of an RPC stream.
 */
"use strict";
var chatEventEmitter = require('services/ChatEventEmitter.js');
var EVENTS = require('services/ChatEvents.js');
var grpc = require('grpc');
var path = require('path');


var PROTO_PATH = path.resolve(__dirname, '../../protos/messages.proto');
var messages = grpc.load(PROTO_PATH).messages;
var dispatch = new messages.Dispatch('chatterpillar:50052',
    grpc.credentials.createInsecure());

var stream = dispatch.startConversation();

module.exports = stream;
