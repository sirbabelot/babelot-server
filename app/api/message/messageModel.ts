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
}

module.exports = new Message();
