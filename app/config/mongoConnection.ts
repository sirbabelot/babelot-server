var db = require('mongoose');
var user2 = 'sirblabsalot';
var password = 'bluecakes';

var dbURI = process.env.MONGO_URI

db.connect(dbURI, (err, db) => {
  if (err) { console.log(err); }
  console.log("Connected to Database");
})

module.exports = db;