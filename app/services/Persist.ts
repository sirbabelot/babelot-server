"use strict";

var message = require('../api/message/messageModel.js');
var client = require('../api/client/clientModel.js');
var conversation = require('../api/conversation/conversationModel.js');

class Persist {
  //This will save the message, based on who sent it
  public async saveMessage(fingerPrint, messageToSave){
    var newClient = await client.getClient(fingerPrint);
    console.log('newClient');
    console.log(newClient);
    var messageSaved = await message.saveMessage(fingerPrint, messageToSave);
    console.log('message');
    console.log(messageSaved);
    return await conversation.getConvoAndUpdate(fingerPrint, messageSaved, newClient)
  }
}

module.exports = new Persist();

