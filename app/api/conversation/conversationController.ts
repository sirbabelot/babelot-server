"use strict";
var convo = require('./conversationModel.js');
var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();


router.get('/preview', async function(req, res)  {
  return res.send(await convo.previewList());
});

router.post('/:roomId', async function(req, res) {
  return res.send(await convo.findOrCreate(req.params.roomId));
});

module.exports = router;
