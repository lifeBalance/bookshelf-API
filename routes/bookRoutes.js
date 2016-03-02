var express = require('express');
var router = express.Router();

var bookRouter = function (Book) {

  // Bringing in the controller
  var bookController = require('../controllers/bookController')(Book);

  router.route('/')
    .get(bookController.index)
    .post(bookController.create);

  // Mounting middleware for the `/books/api/:bookId` path.
  router.use('/:bookId', require('../middlewares/findBookById')(Book));
  router.route('/:bookId')
    .get(bookController.show)
    .put(bookController.update);

  return router; // Don't forget to return the router!
};

module.exports = bookRouter;
