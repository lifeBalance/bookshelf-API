# PATCH and DELETE requests
In this section we're gonna take care of `PATCH` and `DELETE` requests.

## PATCH requests
We saw before how `PUT` requests require the whole resource to be send back again, even those fields that weren't being modified. That's exactly the purpose of `PATCH` requests, they allow us to modify resources partially, without having to send back data that's not being touched. Check the following cURL script:
```
curl \
--header "Content-type: application/json" \
--request PATCH \
--data @patch-book.json \
--verbose \
http://localhost:8000/api/books/56d2f7d3ee9a7a645de13893
```

We're modifying again the same book, but this time check the data we're sending back in the `patch-book.json` file:
```json
{
  "genre": "Computer Science",
  "read": true
}
```

The payload of our request only has to include the data that we are effectively modifying, but not the fields that don't change. This time **title** and **author** won't be left in blank, they'll be left untouched.

### The endpoint
In our `bookRoutes.js` file let's define an endpoint for `PATCH` requests:
```js
router.route('/:bookId')
  .get(bookController.show)
  .put(bookController.update)
  .patch(bookController.patchUpdate); // Add this.
```

We've named the handler `patchUpdate` but you can choose whatever name you want. I got my inspiration in the way Rails names **actions** inside controllers, but in this case I had to improvise.

### The controller
Let's go to our `bookController.js` file and implement the `patchUpdate` action:
```js
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
```

The code is very similar to what we did for the `PUT` request, we're just including an if statement as a safety measure to avoid someone accidentally trying to overwrite the `_id` field by submitting a new one.

And that's it, you can start your server if it's not already running and go ahead and run the `patch.sh` file, it should be working.

## DELETE requests
The HTTP `DELETE` verb is quite easy to implement. Let's add the **endpoint** in `bookRoutes.js`:
```js
router.route('/:bookId')
  .get(bookController.show)
  .put(bookController.update)
  .patch(bookController.patchUpdate)
  .delete(bookController.destroy); // Add this.
```

And the handler in `bookController.js`:
```js
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
  ...
  destroy: destroy
};
```

### Deleting a book
Let's use this small script to try out our new `destroy` action:
```
curl \
--header "Content-type: application/json" \
--request DELETE \
--verbose \
http://localhost:8000/api/books/56d2f7d3ee9a7a645de13893
```

We don't need to send any data with our request, just remember to make the script executable before running it:
```
$ chmod +x curl/delete.sh
$ ./delete.sh
```

And that's it, we've implemented all of the HTTP verbs, so we have a very small and simple, nonetheless operative Web service.

> Check the [06-patch-and-delete-requests][1] branch to see the current state of the code at this point.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: put_requests.md
[next]: hateoas.md


<!-- links -->
[1]: https://github.com/lifeBalance/bookshelf-API/tree/06-patch-and-delete-requests
