"use strict";
var amqpClient = require('microservices/chat/amqpClient.js');
var persist = require('services/Persist.js');


async function persistChatBotMessage(message, client) {
  var toFingerprint = client.fingerprint;
  var fromFingerprint = 'bablot_portal_experiment';
  var roomId = client.fingerprint;
  await persist.saveMessage(toFingerprint, fromFingerprint, roomId, message);
}

// Hack, but a small one
var send2;

module.exports = {

  addEventHandlerToSocket: function(socket, client) {
    amqpClient.sendMessage('reset conversation', (message) => {
      persistChatBotMessage(message, client);
      socket.emit('direct message', { message: message });
    });

    socket.on('direct message', send2 = (data) => {
      amqpClient.sendMessage(data.message, (message) => {
        persistChatBotMessage(message, client);
        socket.emit('direct message', { message: message });
      });
    });
  },

  endChat: function(socket) {
    socket.removeListener('direct message', send2);
  }
};
