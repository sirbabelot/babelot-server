var conversationModel = require('../config/mongoConnection.js').Schema({
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

module.exports = conversationModel;