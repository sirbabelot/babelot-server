"use strict";
var express = require('express');
var co = require('co');
var router =  express.Router();
var User = require('./userModel.js');
var wrap = require('co-express');
var googleAuth = require(`${__base}/middleware/googleAuth.js`);


/* All User routes first require a user to be logged in */
router.use(googleAuth.isAuthenticated);

/**
 * Retreieve a user by it's ID
 */
router.get('/', wrap(function *(req, res){
    var user = yield User.getAll();
    return res.send(user);
}));

/**
 * Retreieve a user by it's ID
 */
router.get('/:id', wrap(function *(req, res){
    var user = yield User.getById(req.params.id);
    if (user) return res.send(user);

    res.send(404, `No user with id ${req.params.id} was found`)
}));

/**
 * Retreieve a list of connections for a user
 */
 router.get('/:id/connection', wrap(function* (req, res) {
   var connections = yield User.getConnections(req.params.id);
   res.send(connections);
 }));

/** Retreives a user object based on Authorization header
 * Create it if it doesnt exist
 */
router.post('/login', wrap(function* (req, res){
  let googleProfile = req.verifiedPayload;
  let email = googleProfile.email;

  let user = yield User.getByEmail(email);
  if (user) return res.send(user);

  user = yield User.createNewUser(email)
  if (user) return res.send(user);

  res.send(404, `No user with those credentials was found`)
}));

/**
 * Creates a user if it does not yet exist
 */
router.post('/', wrap(function *(req, res){
    var email = req.body.email;
    if (email) {
      let user = yield User.createNewUser(email)
      return res.send(user)
    }

    res.send(404, `Please incluse a valid email body:{ email: <email> }`)
  })
);

router.post('/:id/contact', wrap(function *(req, res){
    let googleProfile = req.verifiedPayload;
    let user_a_id = req.body.user_a_id;
    let user_b_id = req.body.user_b_id;

    var user = yield User.addConnection(user_a_id, user_b_id);
    res.send(user);
  })
);


module.exports = router;
