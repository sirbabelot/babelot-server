"use strict";
var Client = require('services/Client.js');
var chatBot = require('services/chatBot.js');
var chatEventEmitter = require('services/ChatEventEmitter.js');
var chatHandler = require('microservices/chat/chatHandler.js');
var generateName = require('sillyname');
var grpc = require('grpc');
var path = require('path');
var persist = require('services/Persist.js');
var EVENTS = require('services/ChatEvents.js');


module.exports = class ChatService {

  public onlineBusinesses: any;
  public onlineClients: any;
  public namespace: string = '/DEMO_ID';
  public chatEventEmitter = chatEventEmitter;

  constructor(private io) {
    this.onlineBusinesses = new Map();
    this.onlineClients = new Map<string, any>();
  }

  init() {
    var nsp = this.io.of(this.namespace);

    nsp.on('connection', (socket) => {

      socket.on('any.getStatus', () => {
        socket.emit('server.reportStatus', { status: 200 });
      });

      // Businesses emit this when they go on/off line
      socket.on('business.changeStatus', (data) => {
        this.chatEventEmitter.emit(EVENTS.BUSINESS.CHANGE_STATUS);
        if (data.status === 'online') {
          this.onlineBusinesses.set(data.businessId, socket);
          var business = { socket };
          this.onlineClients.forEach((client, fingerprint, map) => {
            this.joinParticipants(business, client);
            chatHandler.endChat(client.socket);
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
        this.chatEventEmitter.emit(EVENTS.CLIENT.START_CONVERSATION);
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
          chatHandler.addEventHandlerToSocket(socket, client);
        }
      });

      socket.on('direct message', (data) => {
        this.chatEventEmitter.emit(EVENTS.DIRECT_MESSAGE);
        this.forwardMessage(data, socket);
      });

      socket.on('disconnect', ()=> {
        this.chatEventEmitter.emit(EVENTS.DISCONNECT);
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

    this.chatEventEmitter.emit('INCOMING_MESSAGE');
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
