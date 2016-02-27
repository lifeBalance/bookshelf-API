var express = require('express');
var router = express.Router();

var bookRouter = function (Book) {

  // Bringing in the controller
  var bookController = require('../controllers/bookController')(Book);

  router.route('/')
    .get(bookController.index);

  router.route('/:bookId')
    .get(bookController.show);

  return router; // Don't forget to return the router!
};

module.exports = bookRouter;
