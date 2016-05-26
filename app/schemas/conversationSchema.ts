"use strict";
var mongoose = require('../config/connections.js').mongo;

var conversationSchema = mongoose.Schema({
  Date: { type: Date, default: Date.now },
  AFingerprint: String,
  BFingerprint: String,
  Messages:[{
    type: mongoose.Schema.Types.ObjectId, ref: 'Message'
  }],
  RoomId: String
});

module.exports = mongoose.model('Conversation', conversationSchema);
