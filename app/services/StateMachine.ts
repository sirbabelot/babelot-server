"use strict";

/**
 * The StateMachine class
 * The constructor takes a config object 
 * as described in the interface Config
 * 
 * The states object may have
 * an onEnter and an onInput function.
 * To go to a different state, the onInput function
 * must return the name (string) of the next state.
 */

interface Config {
  initialState: string;
  states: Object;
}

module.exports = class StateMachine {
  private _currentState;
  private _states;
  public static lastVisitedState;

  constructor(public config: Config) {
    this._states = config.states;
    this._currentState = config.initialState;
    this.goToState(config.initialState);
  }

  turn(data) {
    
    var nextStateName = this._currentState.onInput && this._currentState.onInput(data);
    if (nextStateName) {
      this.goToState(nextStateName);
    }
  }

  private goToState(stateName) {
    if (this._states[stateName]) {
      StateMachine.lastVisitedState = this._currentState;

      this._currentState = this._states[stateName];
      // adding name to the state object so we can access it in the onEnter & onInput
      this._states[stateName].name = stateName;

      this._currentState.onEnter && this._currentState.onEnter();
    } 

    else { console.warn(`State ${stateName} does not exist`); }
  }
}
