# GET requests II. Controllers
In this section we're going to take care of `GET` requests for **single books**. We'll also going to refactor our code to start using **controllers** and injecting whatever we need into our route file.

## Refactoring our route I: Injecting our model
First of all let's refactor `bookRoutes.js` so instead of having to require our **model** here (and later, on every router), we can require it in the entry point of our application, and from there **inject** it into our route. To do that we're going to wrap the code in our route inside a function:

```js
var express = require('express');
var router = express.Router();

var bookRouter = function (Book) {
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

  return router; // Don't forget to return the router!
};

module.exports = bookRouter;
```

Now, in our main file (`app.js`) we'll require the **model** and pass it to the `bookRouter` as an argument:
```js
// Bringing in the model
var Book = require('./models/Book');

// Bringing in the router
var bookRouter = require('./routes/bookRoutes')(Book); // Inject the model!
```

## Refactoring our route II: Controllers
If you check our code above, every time a `GET` request hits the path `/` (mounted at `/api/books`), the anonymous function that we're passing to the `get` method gets executed. That's fine, but we could do better if we take that code and shove it into its own module. So first of all, let's create a folder named `controllers` and inside it, a file named `bookController.js`:
```js
var bookController = function (Book) {

  var index = function (req, res) {
    Book.find(function (err, books) {
      if (err) {
        console.log(err);
      } else {
        res.json(books);
      }
    });
  }

  return {
    index: index // Export the handlers as properties of an object
  };
};

module.exports = bookController;
```

Note that, as we did with the router, we're also wrapping the controller inside a function, so we can inject anything, in this case the `Book` model. Now, in our `bookRoutes.js` file we'll require the controller, and add a reference to the handler in the endpoint:
```js
var express = require('express');
var router = express.Router();

var bookRouter = function (Book) {

  // Bringing in the controller
  var bookController = require('../controllers/bookController')(Book);

  router.route('/')
    .get(bookController.get);

  return router; // Don't forget to return the router!
};

module.exports = bookRouter;
```

## Handling request parameters
Having all our books sent to any `GET` requests is fine, but we want to be able of respond to a request for just one specific book. The way to implement this is by using a technique known as **parameterized routes**, which is gonna be easier to explain with an example. Let's add one to our router, in the `bookRoutes.js` file:
```js
router.route('/:bookId')
  .get(bookController.show);
```

Note that the path we are passing to the `route` method is preceded by a colon. Now check the **handler** we have implemented in our controller (`bookController.js`):
```js
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
```

When the user sends a `GET` request to `/api/books/:bookId`, the value used as `:bookId` will be available on `req.params.bookId`. In our controller, inside the `show` handler we are accessing this value, and using it for pulling a book out of the database.

## Filtering our books using a query string
The same way we have available route parameters in the `req.params` object, we have also access to **query strings** through the `req.query` object. As a refresher, a query string is the segment in a URL which starts after the question mark, and contains `name=value` pairs. For example, if we want to access books that belong to the science fiction genre, we could implement that using query strings, so every `GET` request to `http://localhost/api/books?genre=scifi` will filter the results to only the books on that genre.

In order to do this, we're going to modify our `index` request handler so it looks like this:
```js
var index = function (req, res) {
  var query = {};

  if (req.query.genre) {
    query.genre = req.query.genre;
  }

  Book.find(query, function (err, books) {
    if (err) {
      console.log(err);
    } else {
      res.json(books);
    }
  });
}
```

We've sanitized a bit the received query before sending it to the database. Basically we are checking if the user has attached any query string with the name `genre` and if so, we assign it to the `query` local variable. This variable is the one we use as a query to the database by passing it as a first argument to the `find` method.

> Check the [03-controllers][10] branch to see the current state of the code.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: get_requests.md
[next]: post_requests.md


<!-- links -->
[1]: https://www.mongodb.org/
[2]: http://mongoosejs.com/
[3]: https://github.com/lifeBalance/notes-mongodb
[4]: https://github.com/lifeBalance/mongoose_experiments
[5]: https://www.npmjs.com/package/dotenv
[6]: https://github.com/lifeBalance/dataset.json
[7]: https://github.com/lifeBalance/seed.js
[8]: https://github.com/lifeBalance/seed-promises.js
[9]: http://localhost:800/api/books
[10]: https://github.com/lifeBalance/bookshelf-API/tree/03-controllers
