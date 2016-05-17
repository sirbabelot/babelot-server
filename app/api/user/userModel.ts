"use strict";

var UserHumanDB = require('../../schemas/userSchema.js');

class User {

  async all(){
    return await UserHumanDB.find({});
  }

  //Returns a user object
  async getUser(fingerPrint) {
    console.log('howdie');
    var user = await this.findUser(fingerPrint);
    if (user != null) {
      return user;
    } else {
      var newUser = new UserHumanDB({
        FingerPrint: fingerPrint
      });
      return await newUser.save();
    }
  }

  async findUser(fingerPrint) {
    return await UserHumanDB.findOne({ 
      'FingerPrint': fingerPrint 
    });
  }
}

module.exports = new User();
