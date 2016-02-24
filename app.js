var express = require('express');

var app = express();

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('Bookshelf API');
});

var server = app.listen(port, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
