var express = require('express');
var co = require('co');
var router =  express.Router();
var User = require('./userModel.js')
var googleAuth = require(`${__base}/middleware/googleAuth.js`);


/* All User routes first require a user to be logged in */
//router.use(googleAuth.isAuthenticated);


router.get('/', (req, res) => {
  co(function *(){
    var googleProfile = req.verifiedPayload
    var user = yield User.where({
      email: googleProfile.email
    }).fetch({});
    if (user) {
      res.send(googleProfile);
    } else {
      User.forge({
        name: req.body.name,
        email: googleProfile.email
      })
      .save()
      .then(function (user) {
        res.send(googleProfile);
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    }
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

router.post('/contact', (req, res) => {
  var googleProfile = req.verifiedPayload;
  User.forge({email: googleProfile.email})
    .fetch({require: true})
    .then(function (user) {
      user.save({
        contacts: req.body.email
      })
      .then(function () {
        res.json({error: false, data: {message: 'User details updated'}});
      })
      .catch(function (err) {
        res.status(500).json({error: true, data: {message: err.message}});
      });
    });
})

module.exports = router;
