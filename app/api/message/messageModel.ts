"use strict";

var MessageDB = require('../../schemas/messageSchema.js');

class Message {
  async getMessagesByIds(messageIds) {
    console.log('messageIds: ' + messageIds);
    return await MessageDB.find({
      '_id': {
        '$in': messageIds
      }
    })
  }

  async saveMessage(fingerPrint, message) {
    console.log('fingerPrint')
    console.log(fingerPrint)
    console.log('message')
    console.log(message)
    return await new MessageDB({
      'Message': message,
      'FingerPrint': fingerPrint
    }).save();
  }
}

module.exports = new Message();
