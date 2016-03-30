var Stately = require('stately.js');
var StateMachine = require('./StateMachine');

var STATES = {
  "GREETING": "Hey, looking for a place to rent?",
  "HOUSE_APT": "are you looking to rent an entire house/apt or rooms?",
  "NO_HELP": "Okay! If you still need  to talk to someone you can checkout our contact section!",
  "ENITRE_HOUSE.ROOMS": "How many rooms will you need?",
  "ROOM_MATES.ROOMS": "How many rooms will you need (1 - 9) ?",
  "MAX_PRICE": "What is your max price per room?",
  "ANYTHING_ELSE": "Anything else I should know?",
  "LOOK_INTO_IT": "Okay then, I’ll look into (house_type)s with (room_num) rooms less than (room_price)",
  "YOU_AGAIN": "Oh hey! You again!",
  "I_DONT_UNDERSTAND": "I'm not sure I understand."
};

module.exports = {

  chatWith: function(socket) {

    function respond(message) {
      socket.emit('direct message', { message: message });
    }

    var bot = new StateMachine({
      initialState: "GREETING",
      states: {
        "GREETING": {
          onEnter: function() { respond(STATES["GREETING"]) },
          onInput: function(input) {
            if (input.message == "yes") { return "HOUSE_APT" }
            if (input.message == "no") { return "NO_HELP" }
          }
        },
        "NO_HELP": {
          onEnter: function() { respond(STATES["NO_HELP"]) },
          onInput: function() { return "YOU_AGAIN" }
        },
        "HOUSE_APT": {
          onEnter: function() { respond(STATES["HOUSE_APT"]) },
          onInput: function(input) {
            if (input.message == "house") { return "ENTIRE_HOUSE.ROOMS" }
            if (input.message == "rooms") { return "ROOM_MATES.ROOMS" }
          }
        },
        "ENTIRE_HOUSE.ROOMS": {
          onEnter: function() { respond(STATES["ENTIRE_HOUSE.ROOMS"]) },
          onInput: function(input) {
            if (input.message == "1") { return "MAX_PRICE" }
          }
        },
        "ROOM_MATES.ROOMS": {
          onEnter: function() { respond(STATES["ROOM_MATES.ROOMS"]) },
          onInput: function(input) {
            if (input.message == "1") { return "MAX_PRICE" }
          }
        },
        "MAX_PRICE": {
          onEnter: function() { respond(STATES["MAX_PRICE"]) },
          onInput: function(input) {
            if (input.message == "1") { return "ANYTHING_ELSE" }
          }
        },
        "ANYTHING_ELSE": {
          onEnter: function() { respond(STATES["ANYTHING_ELSE"]) },
          onInput: function() { return "LOOK_INTO_IT" }
        },
        "LOOK_INTO_IT": {
          onEnter: function() { respond(STATES["LOOK_INTO_IT"]) },
          onInput: function() { return "YOU_AGAIN" }
        },
        "YOU_AGAIN": {
          onEnter: function() { respond(STATES["YOU_AGAIN"]) },
          onInput: function() { return "YOU_AGAIN" }
        }
      }
    });

    socket.on('direct message', (data) => {
      bot.turn(data);
    });
  }

};
