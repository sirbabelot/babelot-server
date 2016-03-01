var express = require('express');
var co = require('co');
var router =  express.Router();
var User = require('./userModel.js')
var googleAuth = require(`${__base}/middleware/googleAuth.js`);


/* All User routes first require a user to be logged in */
router.use(googleAuth.isAuthenticated);


router.get('/', (req, res) => {
  co(function *(){
    var googleProfile = req.verifiedPayload;
    User.findCreateFind({where: {email: googleProfile.email}})
        .then((user) => {
          res.send(user[0].dataValues)
        });

  });
});

router.post('/contact', (req, res) => {
  var googleProfile = req.verifiedPayload;
})

module.exports = router;
