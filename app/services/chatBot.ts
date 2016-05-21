var Stately = require('stately.js');

var STATES = {
  HEY_THERE: "hey there!",
  GREETING: "are you looking for a place to rent?",
  HOUSE_APT: "do you prefer an entire house/apt or individual room(s)?",
  NO_HELP: "Okay! If you still need  to talk to someone you can checkout our contact section! :D",
  NUM_OF_ROOMS: "How many rooms will you need?",
  MAX_PRICE: "what's your max price per room?",
  ANYTHING_ELSE: "please tell me anything else I should know",
  LOOK_INTO_IT: "I’ll look into places with {room_num} rooms that are less than {room_price}$",
  OK_GOOD: 'ok sounds good!',
  YOU_AGAIN: "Wanna give it another go? :P",
  I_DONT_UNDERSTAND: "uhm..i don't get it lol :P "
};

var bot;

// for checking for valid answers to chatBot's questions
var regex = {
  num_range: /(\d-\d)|(\b(one|two|three|four|five|six|seven|eight|nine|ten|\d)( (to|or|maybe|-) )?\b(one|two|three|four|five|six|seven|eight|nine|ten|\d)?)|(\d)/ig,
  price: /\d{1,9}(?:[. ,]\d{3})*(?:[. ,]\d{2})?/ig,
  no: /(\b)n([o]|\b)([ph]|\b)(e|\b)|never|nah|I don't/ig,
  yes: /(\b)y([eaui .]|\b)([eaphs .]|\b)([ahs .]|\b)|(sure|\bright|fo shizzle|absolutely|totally|totes)|(\bok)/ig,
  house_apt: /house|apartment|apt|entire/ig,
  individual_room: /\broom|individual/ig
}



module.exports = {

  endChat: function(socket){
    console.log('Ending Chat of socket Id:', socket.id);
    socket.removeListener('direct message', sockTest);
  },

  chatWith: function(socket) {

    function respond(message) {
      socket.emit('direct message', { message: message });
    }

    // for storing answers for the summary
    var house_type, room_num, room_price, anything_else;

    var initialState = 'GREETING';
    var statelyConfig = {
      "GREETING": {
        onEnter: function() {
          var stateName = this.name || this.getMachineState()
          if (this.oldState !== 'I_DONT_UNDERSTAND') {
            respond(STATES.HEY_THERE);
          } 
          respond(STATES[stateName]);
        },
        onInput: function(input) {
          if (input.message.search(regex.yes) >= 0) {
            return "HOUSE_APT";
          } else if (input.message.search(regex.no) >= 0) {
            return "NO_HELP";
          } else {
            return "I_DONT_UNDERSTAND";
          }
        }
      },

      "NO_HELP": {
        onEnter: function() { respond(STATES[this.name]) },
        onInput: function() { return "YOU_AGAIN" }
      },

      "HOUSE_APT": {
        onEnter: function() {
          respond(STATES[this.name]);
        },
        onInput: function(input) {
          if (input.message.search(regex.house_apt) >= 0) {
            house_type = 'entire place';
            return "NUM_OF_ROOMS";

          } else if (input.message.search(regex.individual_room) >= 0) {
            house_type = 'individual room';
            return "NUM_OF_ROOMS";
          }
          else if (input.message.search(regex.no) >= 0) {
            return "NO_HELP";
          } else {
            return "I_DONT_UNDERSTAND";
          }
        }
      },

      "NUM_OF_ROOMS": {
        onEnter: function() {
          respond(STATES[this.name]);
        },
        onInput: function(input) {
          var matches = input.message.match(regex.num_range);
          if (matches && matches.length > 0) {
            room_num = matches[0];
            return "MAX_PRICE";
          }
          else { return "I_DONT_UNDERSTAND"; }
        }
      },

      "MAX_PRICE": {
        onEnter: function() {
          respond(STATES[this.name]);
        },
        onInput: function(input) {
          var matches = input.message.match(regex.price);
          if (matches && matches.length > 0) {
            room_price = matches[0];
            return "ANYTHING_ELSE"
          } else {
            return "I_DONT_UNDERSTAND";
          }
        }
      },

      "ANYTHING_ELSE": {
        onEnter: function() { respond(STATES[this.name]) },
        onInput: function(input) {
          anything_else = input.message;
          return "LOOK_INTO_IT"
        }
      },

      "LOOK_INTO_IT": {
        onEnter: function() {
          var newStr = STATES[this.name].replace('{house_type}', house_type)
            .replace('{room_num}', room_num)
            .replace('{room_price}', room_price);

          respond(STATES['OK_GOOD']);
          respond(newStr);
        },
        onInput: function() { return "YOU_AGAIN" }
      },

      "YOU_AGAIN": {
        onEnter: function() { 
          if (this.oldState !== 'I_DONT_UNDERSTAND') {
            respond(STATES.HEY_THERE);
          }
          respond(STATES[this.name]);
        },
        onInput: function(input) {
          if (input.message.search(regex.yes) >= 0) {
            return "HOUSE_APT";
          } else if (input.message.search(regex.no) >= 0) {
            return "NO_HELP";
          } else {
            return "I_DONT_UNDERSTAND";
          }
        }
      },
      
      "I_DONT_UNDERSTAND": {
        onEnter: function(stateStore) {
          respond(STATES[this.name]);
          stateStore.setMachineState(this.oldState);
        }
      }
    }

    bot = Stately.machine(statelyConfig, initialState)
    .bind( function (event, oldState, newState) {
      this[newState].oldState = oldState;
      if (oldState !== newState) {
        this[newState].onEnter(this);
      }
    })

    bot.onEnter();
    socket.on('direct message', sockTest);
  } 

};

function sockTest(data){
  bot.onInput(data);
}
