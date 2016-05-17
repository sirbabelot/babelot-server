"use strict";

class Persist {
  //This will save the message, based on who sent it
  public async saveMessage(message, fingerPrint, type){

    var isRentee = false;
    var isBot = false;

    if (type == 'Bot')
      isBot = true;
    else if (type == 'Rentee')
      isRentee = true;

    var user = await UserHumanDB.findOne({ 'FingerPrint': fingerPrint });

    var newMessage = await new MessageDB({
      'Message': message,
      'IsRentee': isRentee,
      'IsBot': isBot,
      'FingerPrint': fingerPrint
    }).save();

    ConversationDB
      .findOneAndUpdate({
        'Date': Date.now(),
        'UserId': user,
        'FingerPrint': fingerPrint
      }, {
        '$push': { 'Messages': newMessage }
      }, {
        safe: true, upsert: true, new: true
      }, (err) => {
        if (err)
          throw err;
      });
  }

  // //Returns a user object
  // private async getUser(fingerPrint) {
  //   var user = await this.findUser(fingerPrint);
  //   if(user != null){
  //     return user;
  //   }else{
  //     var newUser = new UserHumanDB({
  //       FingerPrint: fingerPrint
  //       });
  //     return await newUser.save();
  //   }
  // }

  // private async findUser(fingerPrint) {
  //   return await UserHumanDB.findOne({ 'FingerPrint': fingerPrint });
  // }

  // //Based on a unique fingerprint, 
  // //this will return the conversation with message
  // public async getConversation(fingerPrint) {
  //   var user = await this.getUser(fingerPrint);
  //   var conversation = await this.createConversation(fingerPrint);

  //   return MessageDB.find({
  //       '_id': {
  //         '$in': conversation.Messages
  //       }
  //     });
  // }

  // //This will check that a conversation exists, if it does not, it wil return null
  // private async checkConversationExists(fingerPrint) {
  //   return await ConversationDB.findOne({ 'FingerPrint': fingerPrint })
  // }

  // private async createConversation(fingerPrint) {
  //   var convo = await this.checkConversationExists(fingerPrint);
    
  //   if (convo == null) {
  //     var user = await this.findUser(fingerPrint);
  //     var newConversation = new ConversationDB({
  //       'UserId': user._id,
  //       'FingerPrint': fingerPrint,
  //       'Messages': []
  //     });
  //     return await newConversation.save();
  //   }else{
  //     return convo;
  //   }
  // }

}

module.exports = new Persist();

