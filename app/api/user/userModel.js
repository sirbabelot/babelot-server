"use strict";
var knex = require(`${__base}/config/connections.js`);


class User {

  /**
   * Creates a new user in the database
   * @param {string} email - a unique email address
   */
  createNewUser(email) {
    var promise = knex('users')
      .returning('*')
      .insert({
        email: email
      }).then(users => {
        return users[0]
      })
    return promise;
  }

  getAll() {
    var promise = knex
        .select('*')
        .from('users');

    return promise;
  }

  /**
   *  Select an individual user by email adress
   *  @param {string} email - users email
   *  @return {promise} containing a user object if found, undefined otherwise
   */
  getByEmail(email) {
    var promise = knex('users')
      .where({
        email: email
      })
      .select('*')
      .limit(1)
      .then(users => {
        return users[0]
      });
    return promise;
  }

  /**
   *  Select an individual user by ID
   *  @param {string} id - users unique id
   *  @return {promise} containing a user object if found, undefined otherwise
   */
  getById(id) {
    var promise = knex('users')
      .where({
        id: id
      })
      .select('*')
      .limit(1)
      .then(users => {
        return users[0]
      });
    return promise;
  }
}


module.exports = new User();
