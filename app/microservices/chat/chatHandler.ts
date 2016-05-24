var chatClient = require('./amqpClient.js');

module.exports = {
  addEventHandlerToSocket: function(socket) {

    chatClient('reset conversation', function(message) {
      socket.emit('direct message', { message: message });
    });

    socket.on('direct message', (data) => {
      chatClient(data.message, function(message) {
        socket.emit('direct message', { message: message });
      });
    });
  }
}