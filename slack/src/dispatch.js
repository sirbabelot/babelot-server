'use strict';
var request = require('superagent');
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var token = process.env.SLACK_API_TOKEN || 'xoxp-44836723207-44833254160-44829737686-9e738c024a';
var channelId;
var rtm = new RtmClient(token, { logLevel: 'error' });
rtm.start();

module.exports = {

  sendMessage(call, callback) {
    let message = call.request;
    rtm.sendMessage(message.message_body, message.to_channel, (err, response)=> {
      console.log(err, response);
      callback(null, message);
    });
  },

  createChannel(call, callback) {
    let channelName = call.request.channel_name;
    console.log('RECEIVED: ', call.request);
    request
      .get(`https://slack.com/api/channels.join?token=xoxp-44836723207-44833254160-44829737686-9e738c024a&name=${channelName}&pretty=1`)
      .end((err, res)=> {
        console.log('RES.BODY: ', res.body);
        callback(null, {
          id: 'res.body.channel.id',
          name: 'res.body.channel.name',
          created: 7,
          creator: 'res.body.channel.creator',
          members: 'res.body.channel.members'
        });
      });
  }
}
