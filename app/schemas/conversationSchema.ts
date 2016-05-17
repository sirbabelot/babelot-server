var db = require('../config/mongoConnection.js');

var conversationSchema = db.Schema({
  Date: {
    type: Date,
    default: Date.now
  },
  ClientId: { 
    type: db.Schema.Types.ObjectId, ref: 'Client' 
  },
  Messages:[{
    type: db.Schema.Types.ObjectId, ref: 'Message'
  }],
  FingerPrint: String
});

module.exports = db.model('Conversation', conversationSchema);