"use strict";

var mongoose = require('mongoose');
var dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI, (err) => {
  if (err) { console.log(err); }
  console.log("Connected to Database");
});

module.exports = {
  mongo: mongoose
};
