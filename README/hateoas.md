# Implementing HATEOAS
Before when we were talking about the 6 constraints of the ReST architectural style we referred to the acronym HATEOAS. It sounds like a big word but in this section we're going to try to clear up any doubts about it. HATEOAS stands for **Hypermedia as the Engine of Application State** and in practice this translates into adding hyperlinks to the representations we are serving through our API, so the user has at every moment several options to navigate through our API in the most intuitive possible way.

## Self-documenting API
So far if the user wants to get an individual book, she has to copy-paste the `_id` of the desired book. The problem is that the user shouldn't need to know about the fact that the `_id` field is used to fetch single books. We could have used any other field such as the **title**, **ISBN** if it existed or whatever. It's much more intuitive if we provide the user with a resource representation that includes all the necessary navigational options.

## Links to individual books
Let's start by modifying the `index` action in our `bookController.js` file. We are going to add a link on every book, so that the user only has to follow it to get taken to the desired book:
```js
...
} else {
  var hyperBooks = [];

  books.forEach(function (book, index, array) {
    var hyperBook = book.toJSON();
    hyperBook.links = {};
    hyperBook.links.self = `http://${req.headers.host}/api/books/${hyperBook._id}`;

    hyperBooks.push(hyperBook);
  });

  res.json(hyperBooks);
}
```

Now, when the user hits the `/api/books` endpoint with a `GET` requests, every single book will include a `links` object property containing a hyperlink (under a property named `self`) to the book itself. Something like this:
```json
"links": {
  "self": "http://127.0.0.1:8000/api/books/56d16720e6882ebe513120af"
}
```

So there's no need for the user to check any documentation, the `self` property is self-explanatory. Notice that we haven't added the links in the database, there's no need for that in this case, we can do it programatically.

## Links to genres
Once we are taken to an individual book, a user may want to see other books in the same genre, so let's do that:
```js
var show = function (req, res) {
  var hyperBook = req.book.toJSON();
  var genreUrl = `http://${req.headers.host}/api/books/?genre=${hyperBook.genre}`;

  hyperBook.links = {};

  hyperBook.links.FilterByThisGenre = genreUrl.replace(' ', '%20');
  res.json(hyperBook);
};
```

Now, when the user is served an individual book, she'll have available a link to the books that belong to the same genre, something like this:
```json
"links": {
"FilterByThisGenre": "http://127.0.0.1:8000/api/books/?genre=Science%20Fiction"
}
```

So you get the idea, with a bit of ingenuity we have implemented HATEOAS in our Web Service, and we didn't have to store this navigational component into the database, it's been dynamically generated.


> Check the [07-HATEOAS][1] branch to see the current state of the code at this point.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: patch_and_delete_requests.md
[next]: #


<!-- links -->
[1]: https://github.com/lifeBalance/bookshelf-API/tree/07-HATEOAS
