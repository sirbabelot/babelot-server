// "use strict";
// var knex = require(`../../config/connections.js`);
// var co = require('co');
// var _ = require('lodash');
// var knex = require(`../../config/connections.js`);

// class User {

//   public knex:any = knex;

//   async findAll() {
//     return this.knex('users').select('*');
//   }

//   async findOne(id, options) {
//     return this.knex('users').select('*').where('id', id)
//         .then((users)=> users[0]);
//   }

//   async findOrCreate(options) {
//     let res :any = {};
//     let users;
//     let acceptedAttrs = ['id', 'nickname', 'img_url', 'email'];

//     // finding an existing user
//     users = await this.knex('users').select('*').where('id', options.id);
//     if (users.length > 0) res.created = false;
//     else {
//       // Format a user object the DB can handle
//       let userToAdd :any = {};
//       acceptedAttrs.forEach((attr)=> {
//         if (_.has(options, attr)) {
//           userToAdd[attr] = options[attr];
//         }
//       });
//       // Attempt to create the new user in the DB
//       await this.knex('users').insert(userToAdd);
//       users = await this.knex('users').select('*').where('id', userToAdd.id);
//       res.created = true;
//     }
//     res.user = users[0];
//     return res;
//   }

//   //////////////////////////// REQUESTS ////////////////////////////

//   async addRequest(toId, fromId) {
//       return await knex.raw(`
//         UPDATE users
//         SET connection_requests=connection_requests||\'{${fromId}}\'
//         WHERE (id=\'${toId}\')`);
//   }

//   async getRequests(toId) {
//     return this.knex.raw(`
//       SELECT id, email, nickname, img_url FROM users AS requesters
//         JOIN
//           ( SELECT connection_requests
//             FROM users
//             WHERE id='${toId}'
//           ) AS me
//         ON  requesters.id = ANY (me.connection_requests)`)
//       .then((res)=>res.rows)
//   }

//   async removeRequest(toId, fromId) {
//     return this.knex.raw(`
//       UPDATE "users" SET
//       "connection_requests"= (
//       SELECT array_remove("connection_requests", '${fromId}') FROM "users" WHERE id='${toId}'
//       )
//       WHERE id='${toId}'`);
//   }

//   //////////////////////////// CONNECTIONS ////////////////////////////

//   async addConnection(id1, id2) {
//     var res = await this.knex('connections')
//       .returning('*')
//       .insert({
//         user_a_id: id1,
//         user_b_id: knex('users').select('id').where('id', id2)
//       })
//       .catch((e)=> {return e})
//     return res;
//   }


//   // TODO look into writing this without using "raw" queries
//   async getConnections(userId) {
//     var connections = await this.knex.raw(`
//       SELECT id, email, nickname, img_url FROM (
//         SELECT * FROM connections
//         WHERE user_a_id='${userId}'
//         OR user_b_id='${userId}'
//         ) AS p
//         INNER JOIN users ON p.user_a_id=users.id OR p.user_b_id=users.id
//         WHERE id != '${userId}'
//     `);

//     connections = _.uniq(connections.rows, 'id');

//     return connections;
//   }

//   async removeConnection(userAId, userBId) {
//     var res = await this.knex('connections')
//       .where({
//         'user_a_id': userAId,
//         'user_b_id': userBId,
//       })
//       .orWhere({
//         'user_a_id': userBId,
//         'user_b_id': userAId,
//       })
//       .del()
//       .catch((e)=> {return e})
//     return res;
//   }

//   async search(params) {
//     if (params.email) {
//       var res = await knex('users')
//           .select('*')
//           .where('email', 'like', `%${params.email}%`)
//       return res;
//     }
//   }
// }


// module.exports = new User();
