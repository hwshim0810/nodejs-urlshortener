module.exports = function(app, conn)
{
  conn.connect();

  app.post('/resister.json', function(req, res) {

  });

  app.get('/:id', function() {

  });

  app.get('/:id/stats', function(req, res) {

  });

  conn.end();
}
