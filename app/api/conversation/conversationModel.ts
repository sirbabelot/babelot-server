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

    conversations.forEach((conversation)=> {
      var messageId = conversation.Messages[conversation.Messages.length - 1]
      mostRecentMessageIds.push(messageId);
    })

    var firstMessages = await messageModel.getMessagesByIds(mostRecentMessageIds);
    var newConversations = []

    firstMessages.forEach((message, i)=> {
      var newConvo = {
        firstMessage: '',
        convo: ''
      }
      newConvo.firstMessage = firstMessages.Body;
      newConvo.convo = conversations[i];
      newConversations.push(newConvo);
    })

    var data = {
      data: newConversations
    }

    return data;
  }

  //Based on a unique roomId,
  //this will return the conversation with message, if not undefined
  public async findOrCreate(AFingerprint: string, BFingerprint: string, roomId: string) {
    var conversationData;
    var conversation = await this.createConversation(AFingerprint, BFingerprint, roomId);
    if(conversation){
      var conversationData:any = {
        messages: await messageModel.getMessagesByIds(conversation.Messages),
        conversation: conversation
      }
    }
    return conversationData;
  }

  async updateConversation(roomId: string, message: string) {
    return await ConversationDB
      .findOneAndUpdate({
        'RoomId': roomId
      }, {
        'Date': Date.now(),
        '$push': { 'Messages': message }
      }, {
        safe: true, upsert: true, new: true
      });
  }

  async createConversation(roomId: string, AFingerprint: string, BFingerprint: string) {
    return await ConversationDB.findOneAndUpdate(
      {
        'RoomId': roomId
      },{
        safe: true,
        new: true,
        upsert: true
      });
  }
}

module.exports = new Conversation();
