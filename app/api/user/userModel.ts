"use strict";
var knex = require(`../../config/connections.js`);
var co = require('co');


class User {

  // Pass in knex rather than require it
  // to make testing easier
  constructor(public knex: any) {}

  async findAll() {
    return this.knex('users').select('*');
  }

  async findOrCreate(id) {
    let res = {};
    let users;
    // finding an existing user
    users = await this.knex('users').select('*').where('id', id);
    if (users.length > 0) res.created = false;
    else {
      await this.knex('users').insert({ id: id });
      users = await this.knex('users').select('*').where('id', id);
      res.created = true;
    }
    res.user = users[0];
    return res;
  }


  /////////////////////////////////////////////////////////////////////
  //////////////////////////// CONNECTIONS ////////////////////////////
  /////////////////////////////////////////////////////////////////////

  async addConnection(id1, id2) {
    try {
      await this.knex('connections').insert({
        user_a_id: id1,
        user_b_id: id2
      });
    } catch(e) { return false; }
    return true;
  }

  async getConnections(userId) {
    var connections = await this.knex.select('id', 'email')
        .from('connections')
        .innerJoin('users', function(){
          this.on('users.id', '=', 'connections.user_b_id')
            .orOn('users.id', '=', 'connections.user_a_id')
        })
        .whereNot({id: userId})
    return connections;
  }

  removeConnectionById(userAId, userBId){
    return co(function* () {
      return knex('connections')
        .where('user_a_id', userAId)
        .orWhere('user_a_id', userBId)
        .orWhere('user_b_id', userAId)
        .orWhere('user_b_id', userBId)
        .del()
    });
  }
}


module.exports = User;
