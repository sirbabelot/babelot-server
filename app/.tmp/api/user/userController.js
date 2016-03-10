"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var express = require('express');
var co = require('co');
var url = require('url');
var _ = require('lodash');
var router = express.Router();
var knex = require(`../../config/connections.js`);
var User = require('./userModel.js');
var user = new User(knex);
var wrap = require('co-express');
var jwt = require('express-jwt');
var authenticate = jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENT_ID
});
router.use(authenticate);
router.get('/graph/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var users = yield user.findAll();
    return res.send(users);
}));
router.get('/graph/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var userData = yield user.findOne(req.params.id);
    if (userData)
        return res.send(userData);
    res.send(404, `No such user exists. They can be created at
            POST /users/graph/${req.params.id}`);
}));
router.post('/graph', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let requiredKeys = ['id', 'nickname', 'img_url'];
    req.body = JSON.parse(req.body);
    var isComposed = _.every(requiredKeys, _.partial(_.has, req.body));
    if (!isComposed)
        return res.send(400, `Missing one or more required keys: ${requiredKeys}`);
    var userData = yield user.findOrCreate({
        id: req.body.id,
        nickname: req.body.nickname,
        img_url: req.body.img_url
    });
    return res.send(userData);
}));
router.get('/search/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var email = req.query.email;
    var users = yield user.search({ email });
    res.send(users);
}));
router.get('/me/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var userData = yield user.findOne(req.user.sub);
    return res.send(userData);
}));
router.get('/me/contacts', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var connections = yield user.getConnections(req.user.sub);
    res.send(connections);
}));
router.post('/me/contacts', (req, res) => __awaiter(this, void 0, void 0, function* () {
    req.body = JSON.parse(req.body);
    var connection = yield user.addConnection(req.user.sub, req.body.id);
    return res.send(connection);
}));
router.delete('/me/contacts/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var deleted = yield user.removeConnection(req.user.sub, req.params.id);
    return res.send(`${deleted}`);
}));
module.exports = router;
