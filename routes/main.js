module.exports = function(app, conn)
{
  conn.connect();

  var context = "http://localhost:3000/";

  function isURL(query) {
    var reg = new RegExp(/^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/);
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

  app.get('/:id', function() {

  });

  app.get('/:id/stats', function(req, res) {

  });

  // conn.end();
}
