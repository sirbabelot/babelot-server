"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var knex = require(`../../config/connections.js`);
var co = require('co');
var _ = require('lodash');
class User {
    constructor(knex) {
        this.knex = knex;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex('users').select('*');
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knex('users').select('*').where('id', id)
                .then((users) => users[0]);
        });
    }
    findOrCreate(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let res = {};
            let users;
            let acceptedAttrs = ['id', 'nickname', 'img_url'];
            users = yield this.knex('users').select('*').where('id', options.id);
            if (users.length > 0)
                res.created = false;
            else {
                let userToAdd = {};
                acceptedAttrs.forEach((attr) => {
                    if (_.has(options, attr)) {
                        userToAdd[attr] = options[attr];
                    }
                });
                yield this.knex('users').insert(userToAdd);
                users = yield this.knex('users').select('*').where('id', userToAdd.id);
                res.created = true;
            }
            res.user = users[0];
            return res;
        });
    }
    addConnection(id1, id2) {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield this.knex('connections')
                .returning('*')
                .insert({
                user_a_id: id1,
                user_b_id: knex('users').select('id').where('id', id2)
            })
                .catch((e) => { return e; });
            return res;
        });
    }
    getConnections(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var connections = yield this.knex.raw(`
      SELECT id, email, nickname, img_url FROM (
        SELECT * FROM connections
        WHERE user_a_id='${userId}'
        OR user_b_id='${userId}'
    ) AS p INNER JOIN users ON p.user_a_id=users.id OR p.user_b_id=users.id
    WHERE id != '${userId}'
    `);
            connections = _.uniq(connections.rows, 'id');
            return connections;
        });
    }
    removeConnection(userAId, userBId) {
        return __awaiter(this, void 0, void 0, function* () {
            var res = yield this.knex('connections')
                .where({
                'user_a_id': userAId,
                'user_b_id': userBId,
            })
                .orWhere({
                'user_a_id': userBId,
                'user_b_id': userAId,
            })
                .del()
                .catch((e) => { return e; });
            return res;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (params.email) {
                var res = yield knex('users')
                    .select('*')
                    .where('email', 'like', `%${params.email}%`);
                return res;
            }
        });
    }
}
module.exports = User;
