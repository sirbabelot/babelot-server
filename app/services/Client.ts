/// <reference path="./../typings/node.d.ts" />
"use strict";
module.exports = class Client {


  constructor(public socket, public fingerprint, public person :Person) {
  }

  toString() {
    return `
        {
          socket: ${this.socket.id},
          nickname: ${this.nickname},
          fingerprint: ${this.fingerprint}
        }`;
  }
}
