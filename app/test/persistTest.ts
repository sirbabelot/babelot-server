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

  app.get('/checkConvoFail', (req, res) => {
    var checkPass = persist.checkConversationExists('Rain dropss');
    checkPass.then((convo) => {
      console.log('5. Complete: Check Conversations exists');
      console.log(convo)
      res.send(convo)
    });
  })

  app.get('/checkConvoPass', (req, res) => {
    var checkPass = persist.checkConversationExists('Rain drops');
    checkPass.then((convo) => {
      console.log('5. Complete: Check Conversations exists');
      console.log(convo)
      res.send(convo)
    });
  })

  app.get('/saveMessage/:fingerPrint/:type', (req, res) => {
    var type = req.params.type;
    var message = 'Message from ' + type
    var fingerPrint = req.params.fingerPrint;
    var saveMsg = persist.saveMessage(message, fingerPrint, type);
    saveMsg.then((msg) => {
      console.log('6. Complete: Saved Message');
      console.log(msg)
      res.send(msg)
    })
  })

  app.get('/getConversation/:fingerPrint', (req, res) => {
    var messages = persist.getConversation(req.params.fingerPrint);
    messages.then((messages) => {
      console.log('then')
      console.log(messages)
      console.log(messages.length)
      res.send(messages)
    }).catch((err)=> {
      res.send(err)
    })
  })
}