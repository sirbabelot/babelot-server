"use strict";
var express = require('express');
var co = require('co');
var url = require('url');
var _ = require('lodash');
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
 * Retreieve a user by it's ID
 */
router.get('/:id', wrap(function *(req, res){
    var user = yield User.getById(req.params.id);
    if (user) return res.send(user);

    res.send(404, `No user with id ${req.params.id} was found`)
}));

/////////////////////////////////////////////////////////////////////
//////////////////////////// CONNECTIONS ////////////////////////////
/////////////////////////////////////////////////////////////////////

/**
 * Retreieve a list of connections for a user
 */
 router.get('/:id/connection', wrap(function* (req, res) {
   var connections = yield User.getConnections(req.params.id);
   res.send(connections);
 }));

router.post('/:id/connection', wrap(function *(req, res){
    let googleProfile = req.verifiedPayload;
    let connectionEmail = req.body.connectionEmail;
    var user = yield User.addConnectionByEmail(googleProfile.email, connectionEmail);

    // Forward the error message
    if(!_.has(user, 'error')) return res.send(user);
    res.send(404, user.error);
  })
);

router.delete('/:id/connection', wrap(function* (req, res) {
  let googleProfile = req.verifiedPayload;
  let connectionId = req.query.connectionId;
  var numDeleted = yield User.removeConnectionById(req.params.id, connectionId);
  res.send(200, numDeleted);
}))


module.exports = router;
