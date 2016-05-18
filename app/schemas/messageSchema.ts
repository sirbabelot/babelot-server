var db = require('../config/mongoConnection.js');

var messageSchema = db.Schema({
  Date: { type: Date, default: Date.now },
  Body: String,
  FromFingerprint: String,
  ToFingerprint: String
});

module.exports = db.model('Message', messageSchema);
