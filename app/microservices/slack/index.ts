"use strict";
/**
 * @fileOverview This file serves as the interface for communicating with
 *     the slack microservice. It responds to chatEventEmitter events
 *     emitted in the lifecylce of a conversation.
 *
 * NOTE(dharness): This file is under active development and its interface
 *     is subject to breaking changes.
 */
var chatEventEmitter = require('services/ChatEventEmitter.js');
var grpc = require('grpc');
var path = require('path');


var PROTO_PATH = path.resolve(__dirname, '../../protos/slack.proto');
var slack = grpc.load(PROTO_PATH).slack;


function main() {

  let dispatch = new slack.Dispatch('slack:50051', grpc.credentials.createInsecure());

  chatEventEmitter.on('INCOMING_MESSAGE', () => {
    // console.log('SLACK SERVICE INCOMING_MESSAGE');
  });

  chatEventEmitter.on('NEW_CONVERSATION', (channelRequest) => {
    var name = channelRequest.channel_name.toString()
    let channelRequest2 = {
      channel_name: name
    };

    // console.log('SENDING: ', channelRequest2);

    dispatch.createChannel(channelRequest2, (err, slackChannel) => {
      // console.log('GRPC_ERR: ', err);
      // console.log('GRPC_RES: ', slackChannel);
    });
  });
}

module.exports = main;
