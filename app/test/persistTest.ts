var persist = require('../services/Persist.js');
  //Persist Testing ===============================

module.exports = function(app){

  app.get('/saveMessage/:fingerPrint/:type', async (req, res) => {
    var type = req.params.type;
    var message = 'Message from ' + type;
    var fingerPrint = req.params.fingerPrint;
    try{
      var saveMsg = await persist.saveMessage(fingerPrint, message);
      res.send(saveMsg)
    }catch(err){
      console.log('Err: ' + err);
    }
  })
}