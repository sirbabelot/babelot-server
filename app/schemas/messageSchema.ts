"use strict";
var mongoose = require('config/connections.js').mongo;

var messageSchema = mongoose.Schema({
  Date: { type: Date, default: Date.now },
  Body: String,
  FromFingerprint: String,
  ToFingerprint: String
});

module.exports = mongoose.model('Message', messageSchema);
