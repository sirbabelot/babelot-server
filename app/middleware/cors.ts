"use strict";
module.exports = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  // intercept OPTIONS method to handle pre-flight requests
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
}
