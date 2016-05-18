"use strict";
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var convo = require('./conversationModel.js');

// var authenticate = jwt({
//   secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
//   audience: process.env.AUTH0_CLIENT_ID
// });

// router.use(authenticate);

router.get('/preview', async (req, res) => {
  return res.send(await convo.previewList());
});

router.get('/', async (req, res) => {
  return res.send(await convo.all());
});

router.get('/:fingerPrint', async (req, res) => {
  return res.send(await convo.findById(req.params.fingerPrint));
});

module.exports = router;
