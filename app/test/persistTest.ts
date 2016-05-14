var persist = require('../services/Persist.js');
  //Persist Testing ===============================

module.exports = function(app){
  app.get('/saveUser', (req, res) => {

    //1. Save User
    var userTest = {
      Name: 'Sir Bablot',
      FingerPrint: 'Rain drops'
    }

    persist.saveUser(userTest)
      .then((user) => {
        console.log('1. Complete: Saved user');
        console.log(user);
        res.send(user)
      })
  })

  app.get('/getUser', (req, res) => {
    persist.getUser('Rain drops')
      .then((user) => {
        console.log('2. Complete: Get user');
        console.log(user);
        res.send(user)
      })
  })

  app.get('/createConvo', (req, res) => {
    var createdConvo = persist.createConversation('Rain drops');
    createdConvo.then((convo) => {
      console.log('4. Complete: Create conversation');
      console.log(convo);
      res.send(convo)
    })
  })

  app.get('/checkConvo', (req, res) => {
    var checkPass = persist.checkConversationExists('Rain dropss');
    checkPass.then((convo) => {
      console.log('5. Complete: Check Conversations exists');
      console.log(convo)
      res.send(convo)
    });
  })

  app.get('/saveMessage', (req, res) => {
    var saveMsg = persist.saveMessage('Howdie', 'Rain drops');
    saveMsg.then((msg) => {
      console.log('6. Complete: Saved Message');
      console.log(msg)
      res.send(msg)
    })
  })

  app.get('/getConversation', (req, res) => {
    var messages = persist.getConversation('Rain drops');
    messages.then((messages) => {
      console.log(messages)
      console.log(messages.length)
      res.send(messages)
    })
  })
}