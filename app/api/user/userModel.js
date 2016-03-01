var Sequelize = require('sequelize');
var sequelize = require(__base + 'config/connections.js');


var User = sequelize.define('users', {
  email: Sequelize.STRING
});


module.exports = User;
