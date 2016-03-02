"use strict";
var express = require('express');
var co = require('co');
var wrap = require('co-express');
var router =  express.Router();
var Connection = require('./connectionModel.js')
var googleAuth = require(`${__base}/middleware/googleAuth.js`);


/* All User routes first require a user to be logged in */
// router.use(googleAuth.isAuthenticated);


router.get('/', wrap(function* (req, res) {
  var connections = yield Connection.getAll(req.params.id);
  res.send(connections);
}));

router.get('/:id', wrap(function* (req, res) {
  var connections = yield Connection.getAllById(req.params.id);
  res.send(connections);
}));

router.post('/', wrap(function* (req, res) {

  let user_a_id = req.body.user_a_id;
  let user_b_id = req.body.user_b_id;
  var connections = yield Connection.addConnection(user_a_id, user_b_id);
  res.send(connections);
}));


module.exports = router;
