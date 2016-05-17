"use strict";

var messageModel = require('../api/message/messageModel.js');
var clientModel = require('../api/client/clientModel.js');
var conversationModel = require('../api/conversation/conversationModel.js');

class Persist {
  //This will save the message, based on who sent it
  public async saveMessage(fingerPrint, messageToSave) {
    var client = await clientModel.findOrCreate(fingerPrint);
    var conversation = await conversationModel.findOrCreate(fingerPrint);
    var messageSaved = await messageModel.saveMessage(fingerPrint, messageToSave);
    await conversationModel.getConvoAndUpdate(fingerPrint, messageSaved, client);
    return messageSaved;
  }
}

module.exports = new Persist();

