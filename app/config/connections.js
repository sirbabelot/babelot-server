'use strict';
var Sequelize = require('sequelize');

var sequelize = new Sequelize('postgres', 'postgres', '', {
  host: '172.17.0.2',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    createdAt: false,
    updatedAt: false
  }
});

module.exports = sequelize;
