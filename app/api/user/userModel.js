var bookshelf = require(__base + 'config/connections.js');


var User =  bookshelf.Model.extend({
  tableName: 'users'
});

module.exports = User;
