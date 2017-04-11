module.exports = function(app)
{
  var mysql      = require('mysql');
  var db_config  = require('../config/db-config.json');

  // [Configure Database]
  var conn = mysql.createConnection({
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database
  });

  conn.connect();

  conn.end();
}
