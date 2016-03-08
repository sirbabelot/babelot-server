// To allow relative requires in other modules
global.__base = __dirname + '/';
require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('./middleware/cors.js');


/* routers */
var userController = require('./api/user/userController.js');
var connectionController = require('./api/connection/connectionController.js');
var tokenController = require('./api/token/tokenController.js');


/* app */
var app = express();
var PORT = process.env.PORT || 8080;

app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// ROUTERS
app.use('/user', userController);
app.use('/connection', connectionController);
app.use('/token', tokenController);

app.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});
