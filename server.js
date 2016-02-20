"use strict";
require('dotenv').load();
var https = require('https');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var Auth = require('./api/controllers/Auth.js');
var knex = require('knex');
var PORT = process.env.PORT || 3443;


app.use(bodyParser.urlencoded({ extended: false }))
// Setup HTTPS
var options = {
  key: fs.readFileSync('config/private.key'),
  cert: fs.readFileSync('config/certificate.pem')
};

app.set('port_https', PORT); // make sure to use the same port as above, or better yet, use the same variable
// Secure traffic only
app.all('*', function(req, res, next){
  if (req.secure) {
    return next();
  };
 res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
});

/* Allow Cross-Origin requests */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/token', Auth.getIMToken);
app.post('/googletoken', Auth.getGoogleToken);

var secureServer = https.createServer(options, app).listen(PORT, () => {
    console.log(`Server listening at https://localhost:${PORT}`);
});
