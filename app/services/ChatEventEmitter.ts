"use strict";
// (dharness) Hack, but a small one because the typings file seems to be incorrect?
interface EventEmitter {
  new (): EventEmitter
}

var EventEmitter:EventEmitter = require('events').EventEmitter;

class ChatEventEmitter extends EventEmitter { }
module.exports = new ChatEventEmitter();
