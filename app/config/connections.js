'use strict';
var knex = require('knex');

var config = knex({
  client: 'pg',
  connection: "postgres://postgres:@172.17.0.2/postgres"
});

var bookshelf = require('bookshelf')(config);

module.exports = bookshelf;
