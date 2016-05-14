/// <reference path="./../typings/node.d.ts" />
"use strict";
var generateName = require('sillyname');
var chatBot = require('./chatBot');
var Client = require('./Client');

module.exports = class ChatService {

  public onlineBusinesses: any;
  public onlineClients: any;
  public namespace: string = '/DEMO_ID';

  constructor(private io) {
    this.onlineBusinesses = new Map();
    this.onlineClients = new Map<string, any>();
  }

  init() {
    var nsp = this.io.of(this.namespace);

    nsp.on('connection', (socket) => {

      // Businesses emit this when they go on/off line
      socket.on('business.changeStatus', (data) => {
        if (data.status === 'online') {
          this.onlineBusinesses.set(data.businessId, socket);
          var business = { socket };
          this.onlineClients.forEach((client, fingerprint, map) => {
            this.joinParticipants(business, client);
          });
        }
        else { this.onlineBusinesses.delete(data.businessId); }

        socket.emit('business.statusChanged', { status: data.status });
        this.io.of(this.namespace).emit('business.statusChanged',
            { status: data.status })
      });

      socket.on('client.startConversation', (data)=> {
        //Create a new client object and store them in the online cache
        if (!data.clientInfo.nickname) {
          data.clientInfo.nickname = generateName();
        }
        var client = new Client(socket,
            data.clientInfo.fingerprint,
            data.clientInfo.nickname);
        client.status = 'online';
        this.onlineClients.set(socket.id, client);

        // Generate a unique ID for each business:client pair
        let business_socket = this.onlineBusinesses.get(data.businessId);
        if (business_socket) {
          this.joinParticipants({ socket: business_socket }, client);
          this.io.of(this.namespace).emit('business.statusChanged',
            { status: 'online' });
        }
        else { chatBot.chatWith(socket); }
      });

      socket.on('direct message', (data) => this.forwardMessage(data, socket));
      socket.on('disconnect', ()=> {
        var client = this.onlineClients.get(socket.id);
        var businessSocket = this.onlineBusinesses.get('ExclusiveRentals.com');
        if (businessSocket && client) {
          client.status = 'offline';
          businessSocket.emit('client.statusChanged', {
            status: 'offline',
            fingerprint: client.fingerprint
          })
        }
      })
    });
  }

  forwardMessage(data, socket) {
    socket.broadcast.to(data.roomId).emit('direct message', {
      nickname: data.nickname,
      fingerprint: data.fingerprint,
      roomId: data.roomId,
      message: data.message
    });
  }

  joinParticipants(business, client) {
    var roomId = [business.socket.id, client.socket.id].sort().join('::');
    [business.socket, client.socket].forEach((s) => {
      s.join(roomId);
      s.emit('client.nowOnline', {
        fingerprint: client.fingerprint,
        nickname: client.nickname,
        status: client.status,
        roomId
      });
    });
  }

}
