var express = require('express');
var router = express.Router();

var Book = require('../models/Book');

router.route('/')
  .get(function (req, res) {
    Book.find(function (err, books) {
      if (err) {
        console.log(err);
      } else {
        res.json(books);
      }
    });
  });

module.exports = router;
