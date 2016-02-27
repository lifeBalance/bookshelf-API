// Importing the connection to the `bookshelf` db.
var bookshelfConn = require('./database');

// Importing the Mongoose model we'll use to write to the db.
var Book = require('./models/Book');

// Importing the Data to populate the db.
var books = require('./dataset');

// When the connection is ready, do the music!
bookshelfConn.on('open', function () {
  dropDb(seedDb, closeDb);
});

function dropDb (cb1, cb2) {
  bookshelfConn.db.dropDatabase();
  console.log('Database dropped!');
  cb1(cb2);
}

function seedDb (cb) {
  console.time('Seeding Time'); // Benchmarking the seed process.

  // Warning! Slow IO operation.
  books.forEach(function (book) {
    new Book(book).save(function (err) {
      if (err) console.log('Oopsie!', err);
    });
    console.log('Seeding:', book);
  });

  console.timeEnd('Seeding Time'); // Benchmarking the seed process.

  cb();
}

function closeDb () {
  setTimeout(function () {
    bookshelfConn.close(function () {
      console.log('Mongoose connection closed!');
    });
  }, 1000); // Delay closing connection to give enough time to seed!
}
