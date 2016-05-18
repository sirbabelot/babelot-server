"use strict";
var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

var message = require('./messageModel.js');

// var authenticate = jwt({
//   secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
//   audience: process.env.AUTH0_CLIENT_ID
// });

// router.use(authenticate);

//Get messages
router.get('/message', async (req, res) => {
  return res.send(await message());
});

module.exports = router;
