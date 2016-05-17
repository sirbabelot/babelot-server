var db = require('../config/mongoConnection.js');

var clientSchema = db.Schema({
  Name: String,
  Date: {
    type: Date,
    default: Date.now
  },
  FingerPrint: String,
  NickName: String
});

module.exports = db.model('Client', clientSchema);