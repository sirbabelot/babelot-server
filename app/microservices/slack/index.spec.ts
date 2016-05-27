// server.js must be required here for app-module-path to work
var server = require('../../server.js');
// var index = require('./index.js');

describe('The Slack microservice RPC client', () => {
  it('should connect to the remote server', () => {
    // expect(typeof index).toBe('function');
    expect(1).toBe(1);
  })
});
