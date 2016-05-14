"use strict";
var db = require('../config/mongoConnection.js');
var UserHuman = db.model('User', require('../models/userModel.js'));
var Conversation = db.model('Conversation', require('../models/conversationModel.js'));
var Message = db.model('Message', require('../models/messageModel.js'));

class Persist {

  async saveUser(user) {
    var newUser = new UserHuman({
      Name: user.Name,
      FingerPrint: user.FingerPrint
    });

    return await newUser.save();
  }

  async getUser(fingerprint){
    return await UserHuman.findOne({ 'FingerPrint': fingerprint });
  }

  //This will check that a conversation exists, if it does not, it wil return null
  async checkConversationExists(fingerPrint) {
    return await Conversation.findOne({ 'FingerPrint': fingerPrint })
  }

  async createConversation(fingerPrint) {
    var user = await UserHuman.findOne({ 'FingerPrint': fingerPrint });
    var newConversation = new Conversation({
      'UserId': user,
      'FingerPrint': fingerPrint,
      'Messages': []
    })

    return await newConversation.save();
  }

  async saveMessageHuman(message, fingerPrint){
    var user = await UserHuman.findOne({ 'FingerPrint': fingerPrint })

    var newMessage = await new Message({ 
      'Message': message ,
      'UserId': user,
      'IsRentee': false,
      'IsBot': false,
      'FingerPrint': fingerPrint
    }).save();

    return await Conversation
      .findOneAndUpdate({
        'UserId': user,
        'FingerPrint': fingerPrint,
      }, {
        '$push': { 'Messages': newMessage }
      }, {
        safe: true, upsert: true, new: true
      });
  }

  async saveMessageRentee(message, fingerPrint){
    var user = await UserHuman.findOne({ 'FingerPrint': fingerPrint })

    var newMessage = await new Message({ 
      'Message': message ,
      'UserId': user,
      'IsRentee': true,
      'IsBot': false,
      'FingerPrint': fingerPrint
    }).save();

    return await Conversation
      .findOneAndUpdate({
        'UserId': user,
        'FingerPrint': fingerPrint,
      }, {
        '$push': { 'Messages': newMessage }
      }, {
        safe: true, upsert: true, new: true
      });
  }

  //This will be used for either the bot,
  async saveMessageBot(message, fingerPrint){
    var newMessage = await new Message({
      'Message': message,
      'IsRentee': false,
      'IsBot': true,
      'FingerPrint': fingerPrint
    }).save();

    return await Conversation
      .findOneAndUpdate({
        'FingerPrint': fingerPrint
      }, {
        '$push': { 'Messages': newMessage }
      }, {
        safe: true, upsert: true, new: true
      });
  }

  //Based on a unique fingerprint, this ill return the conversation
  async getConversation(fingerPrint){
    var user = await UserHuman.findOne({ 'FingerPrint': fingerPrint });

    var conversation = await Conversation.findOne({ 'UserId': user._id });

    return await Message.find({
      '_id': {
        '$in': conversation.Messages
      }
    });
  }

}

module.exports = new Persist();

