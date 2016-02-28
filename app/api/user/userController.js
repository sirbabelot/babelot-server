var express = require('express');
var co = require('co');
var router =  express.Router();
var User = require('./userModel.js')
var googleAuth = require(`${__base}/middleware/googleAuth.js`);


/* All User routes first require a user to be logged in */
router.use(googleAuth.isAuthenticated);


router.get('/', (req, res) => {
  co(function *(){
    // var user = yield User.where({}).fetch({});
    var googleProfile = req.verifiedPayload
    res.send(googleProfile);
  });
});

router.get('/login', (req, res) => {
  co(function *(){
    var googleProfile = req.verifiedPayload;
    var user = yield User.where({
      email: googleProfile.email
    }).fetch({});
    res.send(user);
  });
})

/* /user/:id */
router.get('/:id', (req, res) => {
  res.send('elmos')
})

module.exports = router;
