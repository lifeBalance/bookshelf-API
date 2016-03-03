# PUT requests
In this section we're gonna implement the logic to deal with `PUT` requests, meaning requests intended to replace the whole content  of a given resource with new data.

So we'll start by the following **endpoint** in our `bookRoutes.js` file:
```js
router.route('/:bookId')
  .get(bookController.show)
  .put(bookController.update); // <= Add this.
```

And then, in our `bookController.js` file we'll add the handler to deal with the requests to the endpoint we've just created:
```js
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

return {
  ...
  update: update // Don't forget to return the handler.
};
```

As you can see, in order to update a given book in the database, we need to define the book we want to update, and that's done using the same logic we used for the `show` handler, so we are not being as [DRY][3] as we should, but don't worry, we'll deal with that a bit later.

In this case the new part is where we replace the content of each of the fields in the found book, with the data included in the `PUT` request payload, accessible via `req.body`. We have used a `for in` loop to iterate over the properties included in the `req.body` object.

## A cURL script
Let's try our brand new route with the following script. We've added the `verbose` option so cURL will give us back the response with a lot of useful info(headers, status codes, etc) when working with APIs:
```
curl \
--header "Content-type: application/json" \
--request PUT \
--data @put-book.json \
--verbose \
http://localhost:8000/api/books/56d2f7d3ee9a7a645de13893
```

We're going to **update** two of the fields for the last book we created, check the `put-book.json` file which contains the data:
```json
{
  "author": "Andrew Hunt, Dave Thomas",
  "genre": "IT", // Updating this
  "title": "The Pragmatic Programmer",
  "read": false // And this
}
```

> The JSON format doesn't handle **comments**, so don't copy-paste the above ;)

Even though we are modifying only the **genre** and **read** fields, we have to send back the rest of the fields for the book, even if they don't change. That's the thing about `PUT` requests, they modify the whole resource, so for example if we sent only the two fields we want to modify, the payload of our request would be just:
```json
{
  "genre": "IT",
  "read": false
}
```

Then the resource will be modified in its entirety, with empty fields for **author** and **title**, and that's not clearly what we want. Bottom line, `PUT` requests require us to send the whole resource data even if we are only modifying a small part of the information. In the next section we'll take care of `PATCH` requests, which allow us to modify part of the resource sending only the data we want to modify.

## Adding some middleware
Before we mentioned we were repeating ourselves using the same exact logic in two places. To avoid that, we're gonna take the repeated code and put it in a unique place using Express middleware. If you don't know what middleware is check the excellent [Express docs][1].

1. So let's create a folder named `middleware` and inside it a file named `findBookById.js`, which is gonna contain our middleware:
  ```js
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
  ```
  As you can see we are wrapping everything inside an **anonymous function** so we can inject stuff, in this case the `Book` model. Note also how **we must return** the code we are wrapping.

2. Anyways, now we have to require the middleware and mount it in the file where we have our routes, `bookRoutes.js`:
  ```js
  // Mounting middleware for the `/books/api/:bookId` path.
  router.use('/:bookId', require('../middlewares/findBookById')(Book)); // Injecting the Book model
  ```

  Yep, we're requiring inline, nothing wrong with that, and we're also injecting the `Book` model at the same time we require the module.

3. Finally, let's refactor our `bookController.js`, so the `show` and `update` actions will be much simpler:
  ```js
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
  ```

  Thanks to our middleware, the book data is added to the request object in `req.book`, and we have it available in the handlers that end the request-response cycle.

And we're done with this section.

> Check the [05-put-requests][2] branch to see the current state of the code.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: post_requests.md
[next]: patch_and_delete_requests.md


<!-- links -->
[1]: http://expressjs.com/en/guide/writing-middleware.html
[2]: https://github.com/lifeBalance/bookshelf-API/tree/05-put-requests
[3]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
