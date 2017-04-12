// [Load Package]
var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
// [Load DB Connection]
var conn = require('./config/db-conn');

// [Configure App]
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// [CONFIGURE ROUTER]
var router = require('./routes/main')(app, conn);

// [Run Server]
app.listen(3000, function() {
  console.log("Server start");
});
