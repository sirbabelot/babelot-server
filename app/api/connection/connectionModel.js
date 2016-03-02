"use strict";
var knex = require(`${__base}/config/connections.js`);


class Connection {


  getAll() {
    var promise = knex
        .select('*')
        .from('users');

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
        console.log(connection)
        return connection
      });
    return promise;
  }
}


module.exports = new Connection();
