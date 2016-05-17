"use strict";

var ClientDB = require('../../schemas/clientSchema.js');

class ClientModel {

  async all(){
    return await ClientDB.find({});
  }

  //Returns a user object
  async findOrCreate(fingerPrint) {
    // console.log('howdie2');
    var clientFind = await this.findClient(fingerPrint);
    // console.log('client')
    // console.log(clientFind)
    if (clientFind != null) {
      return clientFind;
    } else {
      console.log('saving user')
      var newClient = new ClientDB({
        FingerPrint: fingerPrint
      });
      return await newClient.save();
    }
  }

  async findClient(fingerPrint) {
    return await ClientDB.findOne({ 
      'FingerPrint': fingerPrint 
    });
  }
}

module.exports = new ClientModel();
