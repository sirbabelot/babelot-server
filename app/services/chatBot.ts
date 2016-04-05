/** Defines the set of 'states' the chat bot can be in */
var StateMachine = require('./StateMachine');

var STATES = {
  "GREETING": "Hey, looking for a place to rent?",
  "GREETING2": "are you looking for a place to rent?",
  "HOUSE_APT": "are you looking to rent an entire house/apt or individual room(s)?",
  "NO_HELP": "Okay! If you still need  to talk to someone you can checkout our contact section! :D",
  "NUM_OF_ROOMS": "How many rooms will you need?",
  "MAX_PRICE": "what's your max price per room?",
  "ANYTHING_ELSE": "please tell me anything else I should know",
  "LOOK_INTO_IT": "Okay then, I’ll look into (house_type)s with (room_num) rooms less than (room_price)",
  "YOU_AGAIN": "oh hey there! Wanna give it another go? :P",
  "I_DONT_UNDERSTAND": "Oh, um ok.. "
};

module.exports = {

  chatWith: function(socket) {

    function respond(message) {
      socket.emit('direct message', { message: message });
    }

    function onStateEnter(stateName) {
      if (StateMachine.lastVisitedState === stateName) {
        respond(STATES["I_DONT_UNDERSTAND"] +  STATES[stateName])
      } else {
        respond(STATES[stateName])
      }
    }

    var bot = new StateMachine({
      initialState: "GREETING",

      states: {
        "GREETING": {
          onEnter: function() {
            if (StateMachine.lastVisitedState ==='GREETING') {
              respond(STATES["I_DONT_UNDERSTAND"] +  STATES['GREETING2'])
            } else {
              respond(STATES["GREETING"])
            }
          },
          onInput: function(input) {
            if (input.message.search(/(\b)y([eaui .]|\b)([eaphs .]|\b)([ahs .]|\b)|(sure|\bright|fo shizzle|absolutely|totally|totes)|(\bok)/ig) >= 0) {
              return "HOUSE_APT";
            } else if (input.message.search(/(\b)n([o]|\b)([ph]|\b)(e|\b)|never|nah|I don't/ig) >= 0) {
              return "NO_HELP";
            } else {
              return "GREETING"
            }
          }
        },
        "NO_HELP": {
          onEnter: function() { respond(STATES["NO_HELP"]) },
          onInput: function() { return "YOU_AGAIN" }
        },
        "HOUSE_APT": {
          onEnter: function() { 
            onStateEnter("HOUSE_APT");
          },
          onInput: function(input) {
            if (input.message.search(/house|apartment|apt|entire|\broom|individual/ig) >= 0) { 
              return "NUM_OF_ROOMS" 
            }
            else {
              return "HOUSE_APT"
            }
          }
        },
        "NUM_OF_ROOMS": {
          onEnter: function() { 
            onStateEnter("NUM_OF_ROOMS");
          },
          onInput: function(input) {
            if (input.message.search(/\d|one|two|three|four|five|six|seven|eight|nine|ten/ig) >= 0) { 
              return "MAX_PRICE" 
            }
            else { return "NUM_OF_ROOMS"}
          }
        },
        "MAX_PRICE": {
          onEnter: function() { 
            onStateEnter("MAX_PRICE");
          },
          onInput: function(input) {
            if (input.message.search(/\d|one|two|three|four|five|six|seven|eight|nine|ten/ig) >= 0) { return "ANYTHING_ELSE" }
            else {return "MAX_PRICE"}
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
          onInput: function(input) { 
            if (input.message.search(/(\b)y([eaui .]|\b)([eaphs .]|\b)([ahs .]|\b)|(sure|\bright|fo shizzle|absolutely|totally|totes)|(\bok)/ig) >= 0) {
              return "HOUSE_APT";
            } else if (input.message.search(/(\b)n([o]|\b)([ph]|\b)(e|\b)|never|nah|I don't/ig) >= 0) {
              return "NO_HELP";
            }
          }
        }
      }
    });

    socket.on('direct message', (data) => {
      bot.turn(data);
    });
  } 

};
