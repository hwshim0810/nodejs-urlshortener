module.exports = function(app, pool)
{


  var context = "http://localhost:3000/";

  // [Util Method Define]
  function isURL(query) {
    var reg = new RegExp(/^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/);
    return reg.test(query);
  }

  function isDigit(query) {
    var reg = new RegExp(/^[0-9]*$/);
    return reg.test(query);
  }

  // [User Case 1 : registers URL]
  app.post('/resister.json', function(req, res) {
    var long_url = req.query.url;

    if (long_url == undefined || !isURL(long_url)) {
      // [Wrong URL]
      res.status(400).json({reason: "Not enough URL"});
    } else {

      var param = [long_url];

      // [Connecting by Conection pool]
      pool.getConnection(function(err, conn) {
        conn.query("SELECT id FROM urls_tb WHERE long_url=?", param, function(err, rows) {
          if (err) {
            console.err(err);
            conn.release();
            throw err;
          }

            if (rows.length > 0) {
              // [URL is already registered]
              res.status(200).json({url: context + rows[0].id});
            } else {
              // [URL not exist : Generates record]
              conn.query("INSERT INTO urls_tb (long_url) VALUES (?)", param, function(err, rows) {
                if (err) {
                  console.err(err);
                  conn.release();
                  throw err;
                }
                // [Return generated URL]
                res.status(201).json({url: context + rows.insertId});

              });
            }
            // [Connection Release]
            conn.release();
        });
      });
    }

  });

  // [User Case 2 : accesses URL that retrieved from register response]
  app.get('/:id', function(req, res) {

    var param = [req.params.id];

    if (!isDigit(req.params.id)) {
      // [Wrong ID : not digit]
      res.status(400).json({reason: "Wrong Id"});
    } else {
      // [Connecting by Conection pool]
      pool.getConnection(function(err, conn) {
        conn.query("SELECT long_url FROM urls_tb WHERE id=?", param, function(err, rows) {
          if (err) {
            console.err(err);
            conn.release();
            throw err;
          }

          if (rows.length > 0) {
            // [Redirecting Original URL]
            res.redirect(301, rows[0].long_url);
            // [Increases number of visit for the URL record]
            conn.query("UPDATE urls_tb SET visits_cnt = visits_cnt+1 WHERE id=?", param, function(err) {
              if (err) {
                console.err(err);
                conn.release();
                throw err;
              }
            });
          } else {
            // [ID not exist]
            res.status(400).json({reason: "Wrong Id"});
          }
          // [Connection Release]
          conn.release();
        });
      });
    }
  });

  // [User Case 3 : accesses stats URL]
  app.get('/:id/stats', function(req, res) {

    var param = [req.params.id];

    if (!isDigit(req.params.id)) {
      // [Wrong ID : not digit]
      res.status(400).json({reason: "Wrong Id"});
    } else {
      // [Connecting by Conection pool]
      pool.getConnection(function(err, conn) {
        conn.query("SELECT visits_cnt FROM urls_tb WHERE id=?", param, function(err, rows) {
          if (err) {
            console.err(err);
            conn.release();
            throw err;
          }
          // [Return number of visit for the URL record]
          if (rows.length > 0) {
            res.status(200).json({visits: rows[0].visits_cnt});
          } else {
            // [ID not exist]
            res.status(400).json({reason: "Wrong Id"});
          }
          // [Connection Release]
          conn.release();
        });
      });
    }
  });


}
