module.exports = {

  chatWith: function(socket) {
    socket.emit('direct message',
      { message: 'Sorry, we aren\'t available at the moment' });

    socket.on('direct message', (data) => {
      socket.emit('direct message', { message: 'You are chatting with a bot now, but I havent been built' });
    });
  }

};
