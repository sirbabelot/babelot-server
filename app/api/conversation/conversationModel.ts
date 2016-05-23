"use strict";

var ConversationDB = require('../../schemas/conversationSchema.js');
var messageModel = require('../message/messageModel.js');

class Conversation {
  async all() {
    return await ConversationDB.find();
  }

  async previewList(){

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
      newConvo.firstMessage = firstMessages[i].Body;
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
  public async findOrCreate(AFingerprint: string, BFingerprint: string, roomId: string) {
    
    var conversation = await this.createConversation(AFingerprint, BFingerprint, roomId);

    return {
      messages: await messageModel.getMessagesByIds(conversation.Messages),
      conversation: conversation
    }
  }

  async findOne(fingerprint: string){

    var conversation = await ConversationDB.findOne({ '$or': [{ 'AFingerprint': fingerprint }, { 'BFingerprint': fingerprint }] });
    
    return {
      messages: await messageModel.getMessagesByIds(conversation.Messages),
      conversation: conversation
    }
  }

  async updateConversation(roomId: string, message: string) {
    return ConversationDB
      .findOneAndUpdate({
        'RoomId': roomId
      }, {
        'Date': Date.now(),
        '$push': { 'Messages': message }
      }, {
        safe: true, upsert: true, new: true
      });
  }

  //This will check that a conversation exists, if it does not, it wil return null
  async checkConversationExists(roomId: string) {
    var convo = await ConversationDB.findOne({'RoomId': roomId});
    return  convo ? convo : undefined;
  }

  async createConversation(AFingerprint: string, BFingerprint: string, roomId: string) {

    var convo = await this.checkConversationExists(roomId);

    if (convo == undefined) {
      var newConversation = new ConversationDB({
        'RoomId': roomId,
        'AFingerprint': AFingerprint, 
        'BFingerprint': BFingerprint,
        'Messages': []
      });
      return await newConversation.save();
    } else {
      return convo;
    }
  }
}

module.exports = new Conversation();