var db = require('mongoose');
var user2 = 'sirblabsalot';
var password = 'bluecakes';
var dbURI = 'mongodb://' + user2 + ':' + password + '@ds061984.mlab.com:61984/bablot'

db.connect(dbURI, (err, db) => {
  if (err) {
    console.log(dbURI);
  }
  if(db)
    console.log("Connected to Database");
})

module.exports = db;