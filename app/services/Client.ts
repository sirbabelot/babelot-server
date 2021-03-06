"use strict";
module.exports = class Client {

  constructor(
    public socket,
    public fingerprint,
    public nickname) { }

  toString() {
    return `
        {
          socket: ${this.socket.id},
          nickname: ${this.nickname},
          fingerprint: ${this.fingerprint}
        }`;
  }
}
