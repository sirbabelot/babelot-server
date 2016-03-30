"use strict";


module.exports = class StateMachine {
  private _currentState;
  private _states;
  constructor(public config) {
    this._states = config.states;
    this.goToState(config.initialState);
  }

  turn(data) {
    var nextStateName = this._currentState.onInput(data);
    if (nextStateName) {
      this.goToState(nextStateName);
    }
  }

  private goToState(stateName) {
    if (this._states[stateName]) {
      this._currentState = this._states[stateName];
      this._currentState.onEnter && this._currentState.onEnter();
    }
    else { console.warn(`State ${stateName} does not exist`); }
  }
}
