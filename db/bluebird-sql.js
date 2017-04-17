'use strict';

var db = require('./bluebird-db');

module.exports = {
  getURL: function (param) {
    return db.single("SELECT long_url FROM urls_tb WHERE id=?", [param]);
  },
  getId: function (param) {
    return db.single("SELECT id FROM urls_tb WHERE long_url=?", [param]);
  },
  getVisit: function (param) {
    return db.single("SELECT visits_cnt FROM urls_tb WHERE id=?", [param]);
  },
  setURL: function (conn, value) {
    return conn.queryAsync("INSERT INTO urls_tb (long_url) VALUES (?)", value);
  },
  updateVisit: function (conn, value) {
    return conn.queryAsync("UPDATE urls_tb SET visits_cnt = visits_cnt+1 WHERE id=?", value);
  }
};
