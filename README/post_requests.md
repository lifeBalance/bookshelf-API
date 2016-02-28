# POST requests
In this section we're gonna cover requests using the HTTP `POST` method. These are the ones used to create new resources in our Web service.

## Parsing the body of the requests
In HTTP, by default, the data in the body of a `POST` request is [url-encoded][1] by the user-agent before being sent. This is because the value of the `Content-Type` header in the request is by default `application/x-www-form-urlencoded`. There are another values we can use for the `Content-Type` header, such as `application/json`, which we'll be expecting in the `POST` requests to our API.

In any case, once the request is received in the server, its payload must be decoded and for that we're gonna need to install a package named [body-parser][2]. This package is middleware for Node applications, and includes several parsers:

* URL-encoded form body parser
* JSON body parser
* Raw body parser
* Text body parser

To install it:
```
$ npm i body-parser -S
```

Once installed, we're gonna require it in the entry point of our project and add a couple of lines more:
```js
var bodyParser = require('body-parser');
...
// Adding middleware for parsing JSON payloads
app.use( bodyParser.urlencoded({extended: true}) ); // Use the qs library
app.use( bodyParser.json() ); // To support JSON-encoded bodies
```

In Express we use the `use` method to bind code to an instance of Express (in our example `app`). We already used this method when we were mounting our router, which can be considered as **router-level middleware**. In this case, `body-parser` can be described as **application-level middleware**.

## Creating a route and a handler
Let's implement and **endpoint** for creating new book resources. In the `bookRoutes.js` file let's add:
```js
router.route('/')
  .get(bookController.index);
  .post(bookController.create);
```

And in our `bookController.js` let's add a **temporary handler**:
```js
var create = function (req, res) {
  var book = new Book(req.body);

  res.send(`* The book ${book} has been posted!`);
  console.log(`* The book ${book} has been posted!`);
}
```

## Posting
To send `POST` requests to our API our browser is not gonna be enough, we're gonna need to install something else. One option is a cool Google Chrome's plugin named [Postman][4], available also as an OS X app. If you're a command line fan there's also a utility called [cURL][5], we're gonna go with the second option. I've created a new `curl` folder where I'm gonna put some shell scripts that use **cURL**, for example this one is called `post.sh`:
```
curl \
--header "Content-type: application/json" \
--request POST \
--data @book.json \
http://localhost:8000/api/books
```

Here I'm making a `POST` request and using a JSON file named `book.json` which contains a simple book:
```json
{
  "author": "Andrew Hunt, Dave Thomas",
  "genre": "Computer Science",
  "title": "The Pragmatic Programmer",
  "read": true
}
```

To run the script first we have to make it executable:
```
$ chmod +x post.sh
$ ./post.sh
* The book { read: true,
  _id: 56d2f4ce9877d6285df22898,
  title: 'The Pragmatic Programmer',
  genre: 'Computer Science',
  author: 'Andrew Hunt, Dave Thomas' } has been posted!
```

If everything goes according to plan we'll get back the data above.

## Writing to the database
Let's write the definitive handler to save the posted book to our database:
```js
var create = function (req, res) {
  var book = new Book(req.body);
  book.save(); // Save the book to the db.
  res.status(201).send(book);
  console.log(`* The book ${book} has been posted!`);
}
```

And that's it, start the server if it's not running, execute the `post.sh` cURL script and check the database to see if the book is there, it should be.


> Check the [04-post-requests][6] branch to see the current state of the code.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: get_requests_2.md
[next]: #


<!-- links -->
[1]: https://en.wikipedia.org/wiki/Percent-encoding
[2]: https://en.wikipedia.org/wiki/Percent-encoding
[3]: https://www.npmjs.com/package/qs
[4]: https://www.getpostman.com/
[5]: https://curl.haxx.se/
[6]: https://github.com/lifeBalance/bookshelf-API/tree/04-post-requests
