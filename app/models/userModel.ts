var userModel = require('../config/mongoConnection.js').Schema({
  Name: String,
  Date: {
    type: Date,
    default: Date.now
  },
  FingerPrint: String
});

module.exports = userModel;