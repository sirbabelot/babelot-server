'use strict';
var knex = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        database: process.env.POSTGRES_DATABASE
    }
});
module.exports = knex;
