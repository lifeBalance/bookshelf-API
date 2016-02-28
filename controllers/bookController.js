var bookController = function (Book) {

  var index = function (req, res) {
    var query = {};

    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    Book.find(query, function (err, books) {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.json(books);
      }
    });
  }

  var show = function (req, res) {
    Book.findById(req.params.bookId, function (err, book) {
      if (err) {
        console.log(err);
        res.status(404).send(err);
      } else {
        res.json(book);
      }
    });
  }

  var create = function (req, res) {
    var book = new Book(req.body);
    book.save(); // Save the book to the db.
    res.status(201).send(book);
    console.log(`* The book ${book} has been posted!`);
  }

  return {
    index: index,
    show: show,
    create: create
  };
};

module.exports = bookController;
