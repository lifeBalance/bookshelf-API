// Setting environment variables
require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Bringing in the model
var Book = require('./models/Book');

// Bringing in the router
var bookRouter = require('./routes/bookRoutes')(Book);

var database = require('./database');

var port = process.env.PORT || 3000;

// Adding middleware for parsing JSON payloads
app.use( bodyParser.urlencoded({extended: true}) ); // Use the qs library
app.use( bodyParser.json() ); // To support JSON-encoded bodies


// Mounting the router
app.use('/api/books', bookRouter);

app.get('/', function (req, res) {
  res.send('Bookshelf API');
});

var server = app.listen(port, function () {
  console.log('Listening on http://localhost:' + server.address().port);
  console.log("Hit 'Ctrl + C' to stop the server");
});
