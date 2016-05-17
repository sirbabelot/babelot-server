"use strict";
var express = require('express');
var _ = require('lodash');
var router = express.Router();
var jwt = require('express-jwt');


//DATABASE ======================================
// var UserHuman = db.model('User', require('../models/userModel.js'));
var message = require('./messageModel.js');
// var Message = db.model('Message', require('../models/messageModel.js'));

//AUTH ==========================================

// var authenticate = jwt({
//   secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
//   audience: process.env.AUTH0_CLIENT_ID
// });

// router.use(authenticate);


//ROUTER ========================================

//Get messages
router.get('/message', async (req, res) => {
  return res.send(await message());
});

module.exports = router;
