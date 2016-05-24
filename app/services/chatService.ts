/// <reference path="./../typings/node.d.ts" />
"use strict";
var generateName = require('sillyname');
var chatBot = require('./chatBot');
var chatHandler = require('../microservices/chat/chatHandler');
var Client = require('./Client');
var persist = require('./Persist.js');

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
            chatBot.endChat(client.socket);
          });

        }
        else { 
          this.onlineBusinesses.delete(data.businessId); 
        }

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
          let business = {
            socket: business_socket,
            fingerprint: 'bablot_portal_experiment'
          }
          this.joinParticipants(business, client);
          this.io.of(this.namespace).emit('business.statusChanged',
            { status: 'online' });
        }
        else { 
          chatHandler.addEventHandlerToSocket(socket);
        }
      });

      socket.on('direct message', (data) => this.forwardMessage(data, socket));
      
      socket.on('disconnect', ()=> {
        var client = this.onlineClients.get(socket.id);
        var clientSocket = this.onlineClients.get(socket.id) ? this.onlineClients.get(socket.id).socket : undefined;
        var businessSocket = this.onlineBusinesses.get('DEMO_ID');
        // Client is disconnecting, and business is offline.
        if (clientSocket && !businessSocket) {

          //Remove the client from online
          this.onlineClients.delete(socket.id);

          //Inform the business that the client has gone offline
          businessSocket && businessSocket.emit('client.statusChanged', {
            status: 'offline',
            fingerprint: client.fingerprint
          })

        }
        // Client is disconnecting, and business is online.
        else if (clientSocket && businessSocket) {
          //Remove business from online
          this.onlineClients.delete(socket.id);

          businessSocket.emit('client.statusChanged', {
            status: 'offline',
            fingerprint: client.fingerprint
          })

        }
        // Busines is refreshing
        else if (!clientSocket) {
          this.onlineBusinesses.delete('DEMO_ID')

          this.onlineClients.forEach((client, fingerprint, map) => {
            client.socket.emit('business.statusChanged', {
              status: 'offline'
            });
          });
        }
      })
    });
  }

  forwardMessage(data, socket) {
    persist.saveMessage(data.toFingerprint, data.fromFingerprint, data.roomId, data.message);

    socket.broadcast.to(data.roomId).emit('direct message', {
      nickname: data.nickname,
      fromFingerprint: data.fromFingerprint,
      toFingerprint: data.toFringerprint,
      roomId: data.roomId,
      message: data.message
    });
  }

  joinParticipants(business, client) {
    var roomId = client.fingerprint;
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
