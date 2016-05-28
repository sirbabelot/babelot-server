"use strict";
/**
 * The State class represents one state in a conversation's state machine.
 *     It is intended for use with Stately.js
 */
module.exports = class State {
  constructor(events) {
    Object.assign(this, events);
    this.setState = function(stateName) {
      this.setMachineState(this[stateName]);
    }
  }
}

