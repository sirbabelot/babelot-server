var db = require('../config/mongoConnection.js');

var userSchema = db.Schema({
  Name: String,
  Date: {
    type: Date,
    default: Date.now
  },
  FingerPrint: String,
  NickName: String
});

module.exports = db.model('User', userSchema);