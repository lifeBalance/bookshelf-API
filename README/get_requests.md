# GET requests
In this section we're going to start implementing our API. We're gonna start taking care of `GET` requests and sending back a list of items or a single one. We'll also going to need installed [MongoDB][1] and [Mongoose][2] to store the data we want to serve through our API.

## A routes folder
To keep the **entry point** of our application (the `app.js` file) as clean an uncluttered as possible, we're going to take the API's routing to a separate file. First of all let's create a folder named `routes`, and inside it we're gonna create a file named `bookRoutes.js`:

```js
var express = require('express');
var router = express.Router();

router.route('/')
  .get(function (req, res) {
    var dummyJsonData = { data: 'Data sent by our API'};

    res.json(dummyJsonData);
  });

module.exports = router;
```

First thing we've done is requiring Express and use the `Router` class to create a **Router instance** that we have assigned to the `router` identifier. A router instance is a complete an independent routing system that can even take its own middleware, that's why routers are also known as **mini-apps**.

Note that inside our `router` we could have defined our **routes** as we did before, using `router.get`, `router.post`, and so on. Instead we have used the `route` method, which allows us to define the **path** just once, and chain the HTTP methods one after another. This way we reduce redundant code and typos.

Once we've finished we have to export the router.

## Mounting the router
Once the router has been defined in its own separate module, we have to **mount** it in our application. So in our `app.js` we will do:

```js
var bookRouter = require('./routes/bookRoutes');
...
app.use('/api/books', bookRouter);
```

Note we can mount the router wherever we wanted to, in this case we have chosen to do it at `/api/books`, so if we start the server and point our browser to http://localhost:8000/api/books we should see:
```json
{"data":"Data sent by our API"}
```

## Hooking up to a database
Our small API is working, but so far we are serving data hardcoded into the application, not very practical. What we want to do is connect our app to a database and serve real data from there. We've chosen [MongoDB][1] as the database so you're gonna need it installed. If you don't have it already, check [this repo][3] where I cover the installation process in OS X. For other operating systems, Google is your friend.

We're also gonna be using [Mongoose][2], if you don't know what it is, check what I've written [here][4] or Google it. Fortunately, installing this one is quite easy:
```
$ npm i mongoose -S
```

Once Mongoose is installed, we are going to create a file for putting all the database related stuff and call it `database.js`. Inside this file we'll require mongoose, and create a connection to the database:
```js
var mongoose = require('mongoose');

var dbHost = process.env.DB_HOST || 'localhost';

var Book = require('./models/Book');

mongoose.connect('mongodb://' + dbHost + '/bookshelf');

var conn = mongoose.connection;

conn.on('connected', function () {
  console.log(`Successfully connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
});
```

In this file we are requiring `mongoose` and creating a connection to the database using the `connect` method. This method takes a string as an argument. In this case we're building the connection string using three elements:

* A required `mongodb://` prefix, to denote that this is a string in the standard connection format required by MongoDB.
* A variable named `dbHost`. Note that we have declared this variable above, and set it up either to an environment variable named `DB_HOST` or to `'localhost'`.
* Lastly, the name of the MongoDB database. We don't even have to create it, it will be created automatically the first time we connect to it.

In this file we are also requiring a Mongoose **model** named `Book` that we haven't created yet, more about it a bit later.

## Dealing with environment variables
In a previous section we saw how we could set up environment variables from within Node, we did that in our `gulpfile.js` from the `nodemon` configuration. That was ok for our needs, but as our app grows we may want to use more environment variables for our settings. Some of these variables may contain sensitive information that we don't want to make publicly available once we commit our code to a public repository.

To deal with this situation we're going to install a Node package named [dotenv][5] which is super simple to use and will solve our mentioned dilemma. Let's install this package:
```
$ npm install dotenv --save
```

And require it in the entry point of our application adding at the very top:
```js
require('dotenv').config();
```

Now we will create a new file at the root of our project named `.env` with the following content:
```
PORT=8000
DB_HOST=localhost
```

Using `NAME=VALUE` pairs we have set up a couple of variables that will be added to our environment once we start our application. The first one is the one that we set up in the `gulpfile.js`, the second one is the one we're using in the connection string. We can go ahead and delete the `PORT` variable from the `nodemon` configuration, we don't need it there anymore.

Do NOT forget to add the `.env` file to your `.gitignore`, right now it doesn't matter but down the line, we may have to set sensitive information in these environment variables that we don't want out in the air in our public repos. That's the whole point of `dotenv`.

## Trying the connection
Before anything, let's require the database file in our `app.js`:
```js
var database = require('./database');
```

Make sure the server is running, we should see the following logged to the terminal:
```
Listening on http://localhost:8000
Hit 'Ctrl + C' to stop the server
Successfully connected to: mongodb://localhost:27017/bookshelf
```

## Models
As we said, we're going to keep it simple and create just a model for serving books resources. So we'll create a folder named `models` inside which we'll put a file named `Book.js`. These are the contents:
```js
var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;

var BookSchema = new Schema({
  title: { type: String },
  author: { type: String },
  genre: { type: String },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Book', BookSchema);
```

Check my repo about [Mongoose][4] to see what's going on in this file, don't want to repeat myself here.

## Seeding the database
To start playing, we have to fill our database with some data. For that purpose we have added `.json` file which contains an array of books:
```json
[
  {
    "author": "Neal Stephenson",
    "genre": "Science Fiction",
    "title": "Snowcrash",
    "read": true,
  },
  ...
]
```

If you want you can check the file [here][7]. We could import this dataset using a command provided by MongoDB named `mongoimport`, but we want our data to follow the `Book` schema we've defined, so we're going to write a simple seed file. I've added two versions:

* One using callbacks [here][8].
* Another one using Promises [here][9].

Use any of them. You shouldn't have any trouble groking them, both are well commented. And since you probably are gonna want to seed the database more than once, (at least I mess up with the data a lot, best way of learning) add any of them to your `package.json`:
```json
"seed": "node seed-promises.js"
```

Now seed the database running: `$ npm run seed`.

## Sending all the books
At the beginning of this section, we started serving some dummy data our our `bookRoutes.js`. Now we want to pull that data out of our database. First of all, we'll start showing our whole collection of books to `GET` requests to `/api/books` and we want to use  our `Book` model to do that. So let's start by requiring the model file in the route:
```js
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
```

Now if we point our browser to http://localhost:800/api/books we should see the whole collections of books we have in our database.

> Check the [02-routing][666] branch to see the current state of the code.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: getting_started.md
[next]: #


<!-- links -->
[1]: https://www.mongodb.org/
[2]: http://mongoosejs.com/
[3]: https://github.com/lifeBalance/notes-mongodb
[4]: https://github.com/lifeBalance/mongoose_experiments
[5]: https://www.npmjs.com/package/dotenv
[6]: https://github.com/lifeBalance/bookshelf-API/tree/02-routing
[7]: https://github.com/lifeBalance/dataset.json
[8]: https://github.com/lifeBalance/seed.js
[9]: https://github.com/lifeBalance/seed-promises.js
