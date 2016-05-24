"use strict";
module.exports = class State {

  public setState: any;

  constructor(events) {
    Object.assign(this, events);
    this.setState = function(stateName) {
      this.setMachineState(this[stateName]);
    }
  }

}

