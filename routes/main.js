module.exports = function(app, conn)
{
  conn.connect();

  var context = "http://localhost:3000/";

  function isURL(query) {
    var reg = new RegExp(/^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/);
    return reg.test(query);
  }

  function isDigit(query) {
    var reg = new RegExp(/^[0-9]*$/);
    return reg.test(query);
  }

  app.post('/resister.json', function(req, res) {
    var long_url = req.query.url;

    if (long_url == undefined || !isURL(long_url)) {
      res.status(400).json({reason: "Not enough URL"});
    } else {
      var sql_sel = "SELECT id FROM urls_tb WHERE long_url=?";
      var sql_ins = "INSERT INTO urls_tb (long_url) VALUES (?)";
      var param = [long_url];

      conn.query(sql_sel, param, function(err, rows) {
        if (err) {
          console.log(err);
        } else {
          if (rows.length > 0) {
            res.status(200).json({url: context + rows[0].id});
          } else {
            conn.query(sql_ins, param, function(err, rows) {
              if (err) {
                console.log(err);
              } else {
                res.status(201).json({url: context + rows.insertId});
              }
            });
          }
        }
      });
    }
    
  });

  app.get('/:id', function(req, res) {
    var sql_sel = "SELECT long_url FROM urls_tb WHERE id=?";
    var sql_upt = "UPDATE urls_tb SET visits_cnt = visits_cnt+1 WHERE id=?"
    var param = [req.params.id];

    if (!isDigit(req.params.id)) {
      res.status(400).json({reason: "Wrong Id"});
    } else {
      conn.query(sql_sel, param, function(err, rows) {
        if (err) {
          console.log(err);
        } else {
          if (rows.length > 0) {
            res.redirect(301, rows[0].long_url);

            conn.query(sql_upt, param, function(err) {
              if (err) {
                console.log(err);
              }
            });
          } else {
            res.status(400).json({reason: "Wrong Id"});
          }
        }
      });
    }
  });

  app.get('/:id/stats', function(req, res) {
    var sql_sel = "SELECT visits_cnt FROM urls_tb WHERE id=?";
    var param = [req.params.id];

    if (!isDigit(req.params.id)) {
      res.status(400).json({reason: "Wrong Id"});
    } else {
      conn.query(sql_sel, param, function(err, rows) {
        if (err) {
          console.log(err);
        } else {
          if (rows.length > 0) {
            res.status(200).json({visits: rows[0].visits_cnt});
          } else {
            res.status(400).json({reason: "Wrong Id"});
          }
        }
      });
    }
  });


}
