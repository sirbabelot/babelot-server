"use strict";

var messageModel = require('../api/message/messageModel.js');
var conversationModel = require('../api/conversation/conversationModel.js');

class Persist {
  //This will save the message, based on who sent it
  public async saveMessage(toFingerprint, fromFingerprint, roomId, messageBody) {
    var conversation = await conversationModel.findOrCreate(roomId, toFingerprint, fromFingerprint);
    var savedMessaged = await messageModel.saveMessage(toFingerprint, fromFingerprint, messageBody);
    await conversationModel.updateConversation(roomId, savedMessaged);
    return savedMessaged;
  }
}

module.exports = new Persist();

