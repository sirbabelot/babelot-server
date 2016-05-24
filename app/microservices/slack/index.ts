"use strict";
var chatEventEmitter = require('../../services/ChatEventEmitter.js');
var grpc = require('grpc');
var path = require('path');


var PROTO_PATH = path.resolve(__dirname, '../../../protos/slack.proto');
var slack = grpc.load(PROTO_PATH).slack;


function main() {

  let dispatch = new slack.Dispatch('slack:50051', grpc.credentials.createInsecure());

  chatEventEmitter.on('INCOMING_MESSAGE', () => {
    console.log('SLACK SERVICE INCOMING_MESSAGE');
      // let message = {
      //   sender_nickname: 'stinky peter',
      //   message_body: 'Welcome to Canada!',
      //   to_channel: slackChannel.id
      // };

      // dispatch.sendMessage(message, (err, chatMessage) => {
      //   console.log(chatMessage);
      // });
  });

  chatEventEmitter.on('NEW_CONVERSATION', (channelRequest) => {
    var name = channelRequest.channel_name.toString()
    let channelRequest2 = {
      channel_name: name
    };

    console.log('SENDING: ', channelRequest2);

    dispatch.createChannel(channelRequest2, (err, slackChannel) => {
      console.log('GRPC_ERR: ', err);
      console.log('GRPC_RES: ', slackChannel);
    });
  });
}

module.exports = main;
