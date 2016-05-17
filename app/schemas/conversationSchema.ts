var db = require('../config/mongoConnection.js');

var conversationSchema = db.Schema({
  Date: {
    type: Date,
    default: Date.now
  },
  UserId: { 
    type: require('../config/mongoConnection.js').Schema.Types.ObjectId, ref: 'User' 
  },
  Messages:[{
    type: require('../config/mongoConnection.js').Schema.Types.ObjectId, ref: 'Message'
  }],
  FingerPrint: String
});

module.exports = db.model('Conversation', conversationSchema);