'use strict';

// [Load DB & Promise Implementaion]
var mysql      = require('mysql');
var db_config  = require('./db-config.json');
var Promise = require('bluebird');
var using = Promise.using;

// [Promisify MySQL -> Async]
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

// [Create Pool]
var pool = mysql.createPool({
    host     : db_config.host,
    user     : db_config.user,
    password : db_config.password,
    database : db_config.database,
    port     : db_config.port,
    connectionLimit:20,
    waitForConnections:false
});

// [Define Connection]
function getSqlConnection() {
  return pool.getConnectionAsync().disposer(function(connection) {
    pool.releaseConnection(connection);
  });
}


module.exports = {
  // [Simple query]
  single: function (sql, values) {
    return using(getSqlConnection(), function (connection) {
      return connection.queryAsync({
        sql: sql,
        values: values
        // nestTables: true,
        // typeCast: false,
        // timeout: 10000
      });
    });
  },
  // [Go on query]
  query: function (callback) {
    return using(getSqlConnection(), function (connection) {
      return callback(connection);
    });
  },
  // [Transaction]
  trans: function (callback) {
    return using(getSqlConnection(), function (connection) {
      return callback(connection);
    });
  }
};
