"use strict";
var knex = require(`${__base}/config/connections.js`);
var _ = require('lodash');


class Connection {


  getAll() {
    var promise = knex
        .select('*')
        .from('connections');
    return promise;
  }

  /**
   * Get all the connections for a user by id
   * @param  {number} id - the unique id of a user
   */
  getAllById(user_id) {
    var promise = knex('connections')
      .where({
        user_a_id: user_id
      })
      .orWhere({
        user_b_id: user_id
      })
      .select('*');

    return promise;
  }

  addConnectionByEmail(userAEmail, userBEmail) {
    var promise = knex('users')
      .where({
        email: userAEmail
      })
      .orWhere({
        email: userBEmail
      })
      .select('*')
      .then(users => {
        if(users.length < 2) return null
        return knex('connections')
          .insert({
            user_a_id: users[0].id,
            user_b_id: users[1].id
          }).then(connections => {
            return connections
          })
      })
      return promise
  }

  /**
   * adds a connection to a user
   */
  addConnection(userAId, userBId) {
    var promise = knex('connections')
      .insert({
        user_a_id: 1,
        user_b_id: 2
      })
      .then(connection => {
        return connection
      });
    return promise;
  }
}


module.exports = new Connection();
