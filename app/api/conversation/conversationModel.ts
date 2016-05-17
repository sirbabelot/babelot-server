"use strict";

var ConversationDB = require('../../schemas/conversationSchema.js');
var clientModel = require('../client/clientModel.js');
var messageModel = require('../message/messageModel.js');
var _async = require('async');

class Conversation {
  async all() {
    return await ConversationDB.find();
  }

  async previewList(){
    console.log('Previewing list')

    //Get Conversations and sort by date
    var conversations = await ConversationDB.find({}).sort({date: 'desc'});

    //Get First Message of each Conversation and append to each conversation
    var mostRecentMessageIds = []

    for (var i = 0; i < conversations.length; ++i)
      mostRecentMessageIds.push(conversations[i].Messages[conversations[i].Messages.length - 1])

    var firstMessages = await messageModel.getMessagesByIds(mostRecentMessageIds)
    var newConversations = []

    for (var i = 0; i < firstMessages.length; ++i){
      var newConvo = {
        firstMessage: '',
        convo: ''
      }

      newConvo.firstMessage = firstMessages[i].Message;
      newConvo.convo = conversations[i]
      newConversations.push(newConvo)
    }

    var data = {
      data: newConversations
    }

    return data;
  }

  //Based on a unique fingerprint, 
  //this will return the conversation with message
  public async findOrCreate(fingerPrint) {
    
    var conversation = await this.createConversation(fingerPrint);

    return{
      type: 'conversation',
      data: await messageModel.getMessagesByIds(conversation.Messages),
      attributes: conversation
    }
  }

  async getConvoAndUpdate(fingerPrint, message, client){
    return ConversationDB
      .findOneAndUpdate({
        'ClientId': client,
        'FingerPrint': fingerPrint
      }, {
        'Date': Date.now(),
        '$push': { 'Messages': message }
      }, {
        safe: true, upsert: true, new: true
      });
  }

  //This will check that a conversation exists, if it does not, it wil return null
  async checkConversationExists(fingerPrint) {
    return await ConversationDB.findOne({ 'FingerPrint': fingerPrint })
  }

  async createConversation(fingerPrint) {
    var convo = await this.checkConversationExists(fingerPrint);

    if (convo == null) {
      var client = await clientModel.findClient(fingerPrint);
      var newConversation = new ConversationDB({
        'ClientId': client._id,
        'FingerPrint': fingerPrint,
        'Messages': []
      });
      return await newConversation.save();
    } else {
      return convo;
    }
  }
}

module.exports = new Conversation();