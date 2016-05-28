/**
 * @fileoverview  This file contains the logic for interacting with the bot's
 *     state machine and exposes the methods required to do so. All interaction
 *     with the state machine should happen through this file.
 */
"use strict";
var Stately = require('stately.js');
var statelyConfig = require('./statelyConfig.js');


const INITIAL_STATE = '1';
var bot;

/**
 * Reformats the bot's string response to and array of responses
 * @param  {string} botResponse the response from the bot state machine
 * @return {array}             An array of response strings
 */
function getMessagesToSend(botResponse) {
  return botResponse.split(';');
}

/**
 * Runs one input through the bots' state machine and returns the responses.
 * @param  {string} message A message for the state machine - input.
 * @return {array}         An array of response strings
 */
function turn(message) {
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

module.exports = { turn };
