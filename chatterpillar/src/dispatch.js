"use strict";
var engine = require('./engine/engine.js');

class Dispatch {
  startConversation(call) {
    call.on('data', (message) => {
      let responses = engine.turn(message);
      responses.forEach((response) => {
        message.body = response;
        call.write(message);
      });
    });
  }
}

module.exports = new Dispatch();
