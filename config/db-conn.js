var mysql      = require('mysql');
var db_config  = require('./db-config.json');

// [Configure Database]
var conn = mysql.createConnection({
  host     : db_config.host,
  user     : db_config.user,
  password : db_config.password,
  database : db_config.database
});

module.exports = conn;
