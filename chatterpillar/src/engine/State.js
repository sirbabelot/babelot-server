"use strict";
module.exports = class State {
  constructor(events) {
    Object.assign(this, events);
    this.setState = function(stateName) {
      this.setMachineState(this[stateName]);
    }
  }
}

