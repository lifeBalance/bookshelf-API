var mongoose = require('mongoose');

var dbHost = process.env.DB_HOST || 'localhost';

var Book = require('./models/Book');

var connString = 'mongodb://' + dbHost + '/bookshelf';

var conn = module.exports = mongoose.connection; // Export the connection

mongoose.connect(connString, function () {
  console.log(`Successfully connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
});
