require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  console.log(req.secure);
  next()
})

app.use(bodyParser.urlencoded({
    extended: false
  })
);

// MIDDLEWARE
app.use(require('./middleware/cors.js'));
// ROUTERS
app.get('/', (req, res) => {
  res.send('Lemmons')
});

app.listen(PORT, () => {
  console.log(`Server listening at https://localhost:${PORT}`);
});
