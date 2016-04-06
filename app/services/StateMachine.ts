"use strict";

interface Config {
  initialState: string;
  states: Object;
}

module.exports = class StateMachine {
  private _currentState;
  private _states;
  public static lastVisitedState;

  constructor(public config : Config) {
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
      StateMachine.lastVisitedState = this._currentState && this._currentState.name;

      this._currentState = this._states[stateName];
      this._states[stateName].name = stateName;

      this._currentState.onEnter && this._currentState.onEnter();
    } 

    else { console.warn(`State ${stateName} does not exist`); }
  }
}
