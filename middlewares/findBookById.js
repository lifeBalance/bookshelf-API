module.exports = function (Book) {
  return function findBookById(req, res, next) {
    Book.findById(req.params.bookId, function (err, book) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else if (book) {
        req.book = book; // We add the book to the `req` object.
        next(); // And call the next middleware.
      } else {
        res.status(404).send(book);
      }
    });
  };
};
