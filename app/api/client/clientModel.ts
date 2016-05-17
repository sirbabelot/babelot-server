"use strict";

var ClientDB = require('../../schemas/userSchema.js');

class ClientModel {

  async all(){
    return await ClientDB.find({});
  }

  //Returns a user object
  async getClient(fingerPrint) {
    console.log('howdie');
    var client = await this.findClient(fingerPrint);
    if (client != null) {
      return client;
    } else {
      var newClient = new UserHumanDB({
        FingerPrint: fingerPrint
      });
      return await newClient.save();
    }
  }

  async findClient(fingerPrint) {
    return await ClientDB.findClient({ 
      'FingerPrint': fingerPrint 
    });
  }
}

module.exports = new ClientModel();
