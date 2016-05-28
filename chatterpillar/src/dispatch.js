"use strict";
var engine = require('./engine/engine.js');

/**
 * The Dispatch class represents the set of RPC methods which can be called from
 *     the client.
 */
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
