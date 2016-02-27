// Setting environment variables
require('dotenv').config();

var express = require('express');
var app = express();

// Bringing in the router
var bookRouter = require('./routes/bookRoutes');

var database = require('./database');

var port = process.env.PORT || 3000;

// Mounting the router
app.use('/api/books', bookRouter);

app.get('/', function (req, res) {
  res.send('Bookshelf API');
});

var server = app.listen(port, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
