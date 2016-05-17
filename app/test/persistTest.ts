var persist = require('../services/Persist.js');
  //Persist Testing ===============================

module.exports = function(app){

  app.get('/saveMessage/:fingerPrint/:type', (req, res) => {
    var type = req.params.type;
    var message = 'Message from ' + type;
    var fingerPrint = req.params.fingerPrint;
    var saveMsg = persist.saveMessage(message, fingerPrint, type);
    saveMsg.then((msg) => {
      res.send(msg)
    }).catch((err)=> {
      res.send(err);
    })
  })

  app.get('/getConversation/:fingerPrint', (req, res) => {
    var messages = persist.getConversation(req.params.fingerPrint);
    messages.then((messages) => {
      res.send(messages)
    }).catch((err)=> {
      res.send(err);
    })
  })
}