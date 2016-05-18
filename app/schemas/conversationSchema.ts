var db = require('../config/mongoConnection.js');

var conversationSchema = db.Schema({
  Date: { type: Date, default: Date.now },
  AFingerprint: String,
  BFingerprint: String,
  Messages:[{
    type: db.Schema.Types.ObjectId, ref: 'Message'
  }],
  RoomId: String
});

module.exports = db.model('Conversation', conversationSchema);