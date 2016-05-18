"use strict";

var MessageDB = require('../../schemas/messageSchema.js');

class Message {
  async getMessagesByIds(messageIds) {
    return await MessageDB.find({
      '_id': {
        '$in': messageIds
      }
    })
  }

  async saveMessage(toFingerprint, fromFingerprint, message) {
    return await new MessageDB({
      'Body': message,
      'FromFingerprint': fromFingerprint,
      'ToFingerprint': toFingerprint
    }).save();
  }
}

module.exports = new Message();
