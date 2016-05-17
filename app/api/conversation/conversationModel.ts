"use strict";

var ConversationDB = require('../../schemas/conversationSchema.js');
var userModel = require('../user/userModel.js');
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
  public async findById(fingerPrint) {
    console.log('in here')
    var user = await userModel.getUser(fingerPrint);
    console.log(user);
    
    var conversation = await this.createConversation(fingerPrint);
    console.log(conversation);
    return{
      type: 'conversation',
      data: await messageModel.getMessagesByIds(conversation.Messages),
      attributes: conversation
    }
  }

  //This will check that a conversation exists, if it does not, it wil return null
  async checkConversationExists(fingerPrint) {
    return await ConversationDB.findOne({ 'FingerPrint': fingerPrint })
  }

  async createConversation(fingerPrint) {
    var convo = await this.checkConversationExists(fingerPrint);

    if (convo == null) {
      var user = await userModel.findUser(fingerPrint);
      var newConversation = new ConversationDB({
        'UserId': user._id,
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