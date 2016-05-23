"use strict";
var Stately = require('stately.js');
var State = require('./State.js');

var STATES = {
  HEY_THERE: "Hellooo!",
  GREETING: "are you looking for a place to rent?",
  HOUSE_APT: "do you prefer an entire place or individual room(s)?",
  NO_HELP: "Okay! If you still need  to talk to someone you can checkout our contact section! :D",
  NUM_OF_ROOMS: "How many rooms will you need?",
  MAX_PRICE: "what's your max price per room?",
  ANYTHING_ELSE: "please tell me anything else I should know",
  LOOK_INTO_IT: "I’ll look into places with {room_num} rooms that are less than {room_price}$",
  OK_GOOD: 'ok sounds good!',
  YOU_AGAIN: "oh do you want to give it another go? :P",
  I_DONT_UNDERSTAND: "uhm..i don't get it lol :P "
};

// for checking for valid answers to chatBot's questions
var regex = {
  num_range: /(\d-\d)|(\b(one|two|three|four|five|six|seven|eight|nine|ten|\d)( (to|or|maybe|-) )?\b(one|two|three|four|five|six|seven|eight|nine|ten|\d)?)|(\d)/ig,
  price: /\d{1,9}(?:[. ,]\d{3})*(?:[. ,]\d{2})?/ig,
  no: /(\b)n([o]|\b)([ph]|\b)(e|\b)|never|nah|I don't/ig,
  yes: /(\b)y([eaui .]|\b)([eaphs .]|\b)([ahs .]|\b)|(sure|\bright|fo shizzle|absolutely|totally|totes)|(\bok)/ig,
  house_apt: /house|apartment|apt|entire/ig,
  individual_room: /\broom|individual/ig
}

// for storing answers for the summary
var house_type, room_num, room_price, anything_else;

var bot, botResponse;

var statelyConfig = {
  "GREETING": new State({
    onEnter: function() {
      return ['GREETING', `${STATES.HEY_THERE};${STATES.GREETING}`]
    },
    onInput: function(message) {
      if (message.search(regex.yes) >= 0) {
        return ['HOUSE_APT', STATES.HOUSE_APT];
      } else if (message.search(regex.no) >= 0) {
        return ['NO_HELP', STATES.NO_HELP];
      } else {
        return ['GREETING', `${STATES.I_DONT_UNDERSTAND};${STATES.GREETING}`];
      }     
    }
  }),
  "HOUSE_APT": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      if (message.search(regex.house_apt) >= 0) {
        house_type = 'entire place';
        return ['NUM_OF_ROOMS', STATES.NUM_OF_ROOMS]

      } else if (message.search(regex.individual_room) >= 0) {
        house_type = 'individual room';
        return ['NUM_OF_ROOMS', STATES.NUM_OF_ROOMS]
      }
      else if (message.search(regex.no) >= 0) {
        return ['NO_HELP', STATES.NO_HELP]
      } else {
        return ['HOUSE_APT', `${STATES.I_DONT_UNDERSTAND};${STATES.HOUSE_APT}`];
      }
    }
  }),
  "NUM_OF_ROOMS": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      var matches = message.match(regex.num_range);
      if (matches && matches.length > 0) {
        room_num = matches[0];
        return ['MAX_PRICE', STATES.MAX_PRICE]
      }
      else { return ['NUM_OF_ROOMS', `${STATES.I_DONT_UNDERSTAND};${STATES.NUM_OF_ROOMS}`]; }
    }
  }),
  "MAX_PRICE": new State({
    onEnter: function() {
    },
    onInput: function(message) {

      var matches = message.match(regex.price);
      if (matches && matches.length > 0) {
        room_price = matches[0];
        return ['ANYTHING_ELSE', STATES.ANYTHING_ELSE];
      } else {
        return ['MAX_PRICE', `${STATES.I_DONT_UNDERSTAND};${STATES.MAX_PRICE}`];
      }
      return ['ANYTHING_ELSE', STATES.ANYTHING_ELSE]
    }
  }),
  "ANYTHING_ELSE": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      anything_else = message;
      var newStr = STATES.LOOK_INTO_IT.replace('{house_type}', house_type)
        .replace('{room_num}', room_num)
        .replace('{room_price}', room_price);
      return ['OK_GOOD', `${STATES.OK_GOOD};${newStr}`]
    }
  }),
  "OK_GOOD": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      return ['YOU_AGAIN', STATES.YOU_AGAIN]
    }
  }),
  "YOU_AGAIN": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      if (message.search(regex.yes) >= 0) {
        return ['HOUSE_APT', STATES.HOUSE_APT];
      } else if (message.search(regex.no) >= 0) {
        return ['NO_HELP', STATES.NO_HELP];
      } else {
        return ['YOU_AGAIN', `${STATES.I_DONT_UNDERSTAND};${STATES.YOU_AGAIN}`];
      }
  }),
  "NO_HELP": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      return ['YOU_AGAIN', STATES.YOU_AGAIN]
    }
  })
};

function getMessagesToSend(botResponse) {
  let responseArray = botResponse.split(';');
  return JSON.stringify(responseArray);
}

// Function called for every message that comes in
module.exports = function(ch, msg) {

  if (msg.content.toString() === 'reset conversation') {
    bot = Stately.machine(statelyConfig, 'GREETING').bind(function(event, oldState, newState) {
      this[newState].oldState = oldState;
    });
    botResponse = bot.onEnter();
  } else {
    botResponse = bot.onInput(msg.content.toString());
  }

  ch.sendToQueue(msg.properties.replyTo,
    new Buffer(getMessagesToSend(botResponse)), { correlationId: msg.properties.correlationId });
};