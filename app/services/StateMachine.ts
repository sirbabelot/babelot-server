"use strict";


module.exports = class StateMachine {
  private _currentState;
  private _states;
  private _currentStateName;
  public static lastVisitedState;
  constructor(public config) {
    this._states = config.states;
    this.goToState(config.initialState);
    this._currentStateName = config.initialState;
  }

  turn(data) {
    var nextStateName = this._currentState.onInput(data);
    if (nextStateName) {
      this.goToState(nextStateName);
    }
  }

  private goToState(stateName) {
    if (this._states[stateName]) {
      StateMachine.lastVisitedState = this._currentStateName;

      this._currentState = this._states[stateName];
      this._currentStateName = stateName;

      this._currentState.onEnter && this._currentState.onEnter();
    } 

    else { console.warn(`State ${stateName} does not exist`); }
  }
}
