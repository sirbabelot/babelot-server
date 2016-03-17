"use strict";
var User = require('../api/user/userModel.js');


class ChatService {
  private _connectedSockets: any = {};
  private _User: any = User;

  constructor(private io) {}

  sendContactRequest(data) {
    let toSocket = this._connectedSockets[data.to];
    if (toSocket) {
      toSocket.emit('receive contact request', data.from);
    }
    var result = User.addRequest(data.to, data.from.id);
  }

  init() {
    // SOCKET
    this.io.on('connection', (socket)=> {

      socket.on('register', (userid)=> {
        this._connectedSockets[userid] = socket;
        console.log('Registring a user')
        // now, send out all your contact requests
      });

      socket.on('subscribe', (room)=> {
          socket.join(room);
      });

      socket.on('send message', (data)=> {
        this.io.sockets.in(data.room)
          .emit('chat message', {
            room: data.room,
            message: data.message
          });
      });

      socket.on('send contact request', (data)=> this.sendContactRequest(data));
    });
  }

}

module.exports = ChatService;
