/**
 * @fileoverview This file handles the operations required for forwarding
 *     messages to and from chatterpiller as well as opening and closing
 *     event listeners for its conversations.
 */
"use strict";
var persist = require('services/Persist.js');
var stream = require('microservices/chat/grpcClient.js');


/**
 * Uses persist to store conversation data
 * @param {string} message The message content
 * @param {client} client  A client object
 */
async function persistChatBotMessage(message, client) {
  var toFingerprint = client.fingerprint;
  var fromFingerprint = 'bablot_portal_experiment';
  var roomId = client.fingerprint;
  await persist.saveMessage(toFingerprint, fromFingerprint, roomId, message);
}

/**
 * Forwards a message from the chatbot to the client
 * @param {Object} data contains the message:string property
 */
function sendToClient(data) {
  var message = {
    nickname: 'nick_name',
    fromFingerprint: 'f_f',
    roomId: 'room_id',
    body: data.message,
  };
  stream.write(message);
}

/**
 * Sets up event listeners on a socket for a particular client
 *     with the chatbot
 * @param {socket} socket The client's socket
 * @param {client} client A client object
 */
function addEventHandlerToSocket(socket, client) {
  var message = { reset: true };
  stream.write(message);

  // Called when the chatbot sends a message
  stream.on('data', (response) => {
    persistChatBotMessage(response.body, client);
    socket.emit('direct message', { message: response.body });
  });

  // Called when the client sends a message
  socket.on('direct message', sendToClient);
}

/**
 * Removes direct message event listener from a socket
 * @param {socket} socket The socket with the listener
 */
function endChat(socket) {
  socket.removeListener('direct message', sendToClient);
}

module.exports = {
  addEventHandlerToSocket,
  endChat
};
