"use strict";
var messageModel = require('api/message/messageModel.js');
var conversationModel = require('api/conversation/conversationModel.js');


class Persist {
  public async saveMessage(toFingerprint: string, fromFingerprint: string,
        roomId: string, messageBody: string) {
    var conversation = await conversationModel.findOrCreate(roomId, toFingerprint, fromFingerprint);
    var savedMessages = await messageModel.saveMessage(toFingerprint, fromFingerprint, messageBody);
    await conversationModel.updateConversation(roomId, savedMessages);
    return savedMessages;
  }
}

module.exports = new Persist();
