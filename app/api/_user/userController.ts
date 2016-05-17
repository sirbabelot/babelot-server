// "use strict";
// var express = require('express');
// var co = require('co');
// var url = require('url');
// var _ = require('lodash');
// var router =  express.Router();
// var user = require('./userModel.js');
// var wrap = require('co-express');
// var jwt = require('express-jwt');


// var authenticate = jwt({
//   secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
//   audience: process.env.AUTH0_CLIENT_ID
// });

// router.use(authenticate);

// /**
//  * Get minimal data on all users
//  */
// router.get('/graph/', async (req, res)=> {
//     var users = await user.findAll();
//     return res.send(users);
// });

// /**
//  * Retreieve a user by it's ID
//  */
// router.get('/graph/:id', async (req, res)=> {
//     var userData = await user.findOne(req.params.id);
//     if (userData) return res.send(userData);
//     res.send(404,
//         `No such user exists. They can be created at
//             POST /users/graph/${req.params.id}`);
// });


// /* Creates a User in the DB */
// router.post('/graph', async (req, res)=> {
//   let requiredKeys = ['id', 'nickname', 'img_url', 'email'];
//   req.body = JSON.parse(req.body);
//   var isComposed = _.every(requiredKeys, _.partial(_.has, req.body));
//   if (!isComposed) return res.send(400, `Missing one or more required keys: ${requiredKeys}`);
//   var userData = await user.findOrCreate(req.body);
//   return res.send(userData);
// });

// // TODO fix the routes so this is part of graph
// router.get('/search/', async (req, res)=> {
//   var email = req.query.email;
//   var users = await user.search({email});
//   res.send(users);
// });

// router.get('/me/', async (req, res)=> {
//   var userData = await user.findOne(req.user.sub);
//   return res.send(userData);
// });

// router.get('/me/contacts', async (req, res)=> {
//   var connections = await user.getConnections(req.user.sub);
//   res.send(connections);
// });

// router.post('/me/contacts', async (req, res)=> {
//   req.body = JSON.parse(req.body)
//   var connection =  await user.addConnection(req.user.sub, req.body.id);
//   return res.send(connection);
// });

// router.delete('/me/contacts/:id', async (req, res)=> {
//   var deleted = await user.removeConnection(req.user.sub, req.params.id);
//   return res.send(`${deleted}`);
// });

// router.get('/me/requests', async (req, res)=> {
//   var requests = await user.getRequests(req.user.sub);
//   res.send(requests);
// });

// router.delete('/me/requests/:fromId', async (req, res)=> {
//   var isRemoved = await user.removeRequest(req.user.sub, req.params.fromId);
//   res.send(isRemoved);
// });


// module.exports = router;
