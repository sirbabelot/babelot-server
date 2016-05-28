"use strict";
var Stately = require('stately.js');
var statelyConfig = require('./statelyConfig.js');


const INITIAL_STATE = '1';
var bot;

function getMessagesToSend(botResponse) {
  return botResponse.split(';');
}

module.exports = {
  turn: function(message) {
    let response;
    if (message.reset === true) {
      bot = Stately.machine(statelyConfig, INITIAL_STATE).bind(function(event, oldState, newState) {
        this[newState].oldState = oldState;
      });
      response = bot.onEnter();
    } else {
      response = bot.onInput(message.body);
    }
    return getMessagesToSend(response);
  }
};
