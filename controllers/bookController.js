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

  var create = function (req, res) {
    var book = new Book(req.body);
    book.save(); // Save the book to the db.
    res.status(201).send(book);
    console.log(`* The book ${book} has been posted!`);
  }

  var show = function (req, res) {
    res.json(req.book);
  };

  var update = function (req, res) {
    for (var p in req.body) {
      req.book[p] = req.body[p];
    }

    req.book.save(function (err) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log(`* The book ${req.book} has been updated!\n`);
        res.status(200).json(req.book);
      }
    });
  };

  var patchUpdate = function (req, res) {
    if (req.body._id) delete req.body._id;

    for (var p in req.body) {
      req.book[p] = req.body[p];
    }

    req.book.save(function (err) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log(`* The book ${req.book} has been patched!\n`);
        res.status(200).json(req.book);
      }
    });
  };

  var destroy = function (req, res) {
    req.book.remove(function (err) {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        console.log(`* The book ${req.book} has been deleted!\n`);
        res.status(204).send('Book Deleted!');
      }
    });
  }

  return {
    index: index,
    show: show,
    create: create,
    update: update,
    patchUpdate: patchUpdate,
    destroy: destroy
  };
};

module.exports = bookController;
