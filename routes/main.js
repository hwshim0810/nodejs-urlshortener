var util = require('../util/validation');

module.exports = function(app, db, sql)
{
  var context = "http://localhost:3000/";

  // [User Case 1 : registers URL]
  app.post('/resister.json', function(req, res) {
    var long_url = req.query.url;

    // [Validate URL]
    if (long_url == undefined || !util.isURL(long_url)) {
      return res.status(400).json({reason: "Not enough URL"});
    }

    // [Search URL Id]
    var prom = sql.getId(long_url)
    .then(function (rows) {
      // [URL is already registered]
      if (rows.length > 0) {
        res.status(200).json({url: context + rows[0].id});
      } else {
        // [URL not exist : Generates record]
        prom.then(function (result) {
          db.query(function (conn) {
            return sql.setURL(conn, long_url);
          })
          .then(function (rows) {
            // [Return generated URL]
            res.status(201).json({url: context + rows.insertId});
          })
          .catch(function (err) {
            res.status(500).json({msg: err.message});
          });
        });
      }
    })
    .catch(function (err) {
      res.status(500).json({msg: err.message});
    });

  });


  // [User Case 2 : accesses URL that retrieved from register response]
  app.get('/:id', function(req, res) {
    var id = req.params.id;

    // [Wrong ID : not digit]
    if (!util.isDigit(id)) {
      return res.status(400).json({reason: "Wrong Id"});
    }

    // [Search URL]
    var prom = sql.getURL(id)
    .then(function (rows) {
      // [Exist URL]
      if (rows.length > 0) {
        // [Redirecting Original URL]
        res.redirect(301, rows[0].long_url);
        // [Increases number of visit for the URL record]
        prom.then(function (result) {
          db.query(function (conn) {
            return sql.updateVisit(conn, id);
          })
          .catch(function (err) {
            res.status(500).json({msg: err.message});
          });
        });
      } else {
        // [ID not exist]
        res.status(400).json({reason: "Wrong Id"});
      }
    })
    .catch(function (err) {
      res.status(500).json({msg: err.message});
    });

  });


  // [User Case 3 : accesses stats URL]
  app.get('/:id/stats', function(req, res) {
    var id = req.params.id;

    // [Wrong ID : not digit]
    if (!util.isDigit(id)) {
      return res.status(400).json({reason: "Wrong Id"});
    }

    // [Search Visits]
    var prom = sql.getVisit(id)
    .then(function (rows) {
      if (rows.length > 0) {
        // [Return number of visit for the URL record]
        res.status(200).json({visits: rows[0].visits_cnt});
      } else {
        // [ID not exist]
        res.status(400).json({reason: "Wrong Id"});
      }
    })
    .catch(function (err) {
      res.status(500).json({msg: err.message});
    });

  });

}
