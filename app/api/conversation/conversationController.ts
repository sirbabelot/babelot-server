"use strict";
var convo = require('./conversationModel.js');
var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();


router.get('/preview', async function(req, res)  {
  return res.send(await convo.previewList());
});

router.get('/', async function(req, res) {
  return res.send(await convo.all());
});

router.post('/:fingerPrint', async function(req, res) {
  return res.send(await convo.findOrCreate(req.params.fingerPrint));
});

module.exports = router;
