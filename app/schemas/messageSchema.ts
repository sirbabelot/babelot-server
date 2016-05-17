var db = require('../config/mongoConnection.js');

var messageSchema = db.Schema({
  Date: {
    type: Date,
    default: Date.now
  },
  // IsHuman: Boolean, //True if a message from Bablot team
  // IsBot: Boolean, //True if this is our bot
  // IsRentee: Boolean, //True if this is a person looking for a property
  UserId: { type: db.Schema.Types.ObjectId, ref: 'Client' },
  Order: Number,
  Message: String,
  FingerPrint: String
});

module.exports = db.model('Message', messageSchema);
