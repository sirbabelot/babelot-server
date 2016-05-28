var regex = require('./regex.js');
var STATES = require('./states.json');
var State = require('./State.js');


module.exports = {
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
