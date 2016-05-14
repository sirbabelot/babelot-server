"use strict";
var db = require('../config/mongoConnection.js');
var UserHuman = db.model('User', require('../models/userModel.js'));
var Conversation = db.model('Conversation', require('../models/conversationModel.js'));
var Message = db.model('Message', require('../models/messageModel.js'));

class Persist {

  //This will save the message, based on who sent it
  public async saveMessage(message, fingerPrint, type){

    var isRentee = false;
    var isBot = false;

    if (type == 'Bot')
      isBot = true;
    else if (type == 'Rentee')
      isRentee = true;

    var user = await UserHuman.findOne({ 'FingerPrint': fingerPrint })

    var newMessage = await new Message({
      'Message': message,
      'IsRentee': isRentee,
      'IsBot': isBot,
      'FingerPrint': fingerPrint
    }).save();

    Conversation
      .findOneAndUpdate({
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

  //Returns a user object
  private async getUser(fingerprint) {
    var user = await this.findUser(fingerprint);
    if(user!=null){
      return user;
    }else{
      var newUser = new UserHuman({
          FingerPrint: fingerprint
        });
      return await newUser.save();
    }
  }

  private async findUser(fingerprint) {
    return await UserHuman.findOne({ 'FingerPrint': fingerprint });
  }

  //Based on a unique fingerprint, 
  //this will return the conversation with message
  public async getConversation(fingerPrint) {
    var user = await this.getUser(fingerPrint);

    var conversation = await this.createConversation(fingerPrint);

    return Message.find({
        '_id': {
          '$in': conversation.Messages
        }
      });
  }

  //This will check that a conversation exists, if it does not, it wil return null
  private async checkConversationExists(fingerPrint) {
    return await Conversation.findOne({ 'FingerPrint': fingerPrint })
  }

  private async createConversation(fingerPrint) {
    try{
      var convo = await this.checkConversationExists(fingerPrint);
      if (convo == null) {
        var user = await this.findUser(fingerPrint);

        var newConversation = new Conversation({
          'UserId': user._id,
          'FingerPrint': fingerPrint,
          'Messages': []
        });

        return await newConversation.save();
      }else{
        return convo;
      }
    }catch(err){
      throw err;
    }
  }

}

module.exports = new Persist();

