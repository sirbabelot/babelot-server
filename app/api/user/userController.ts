"use strict";
var express = require('express');
var _ = require('lodash');
var router = express.Router();
var jwt = require('express-jwt');


//DATABASE ======================================
var user = require('./userModel.js');

//AUTH ==========================================

// var authenticate = jwt({
//   secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
//   audience: process.env.AUTH0_CLIENT_ID
// });

// router.use(authenticate);


//ROUTER ========================================

//Get messages
router.get('/', async (req, res) => {
  return res.send(await user.all());
});

module.exports = router;
