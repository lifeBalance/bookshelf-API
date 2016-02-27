# Getting Started
First of all let's initialize a `package.json` file and install [Express][1]:
```js
$ mkdir bookshelf-API && cd bookshelf-API
$ npm init -y
$ npm install express -S
```

I like to start with the simplest server, as a sanity test:
```js
var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('Bookshelf API');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
```

This is basically the "Hello world" app from the Express website, but notice the line where we're setting the `port` variable. It's pretty common to use **environment variables** for settings used by our app. The way this works is, when we start a Node app, the Node process has access to the environment variables using the [process.env][2] object. It's good practice though, to code our app without depending too much on the environment variable being set, that's why we wrote:
```js
var port = process.env.PORT || 3000;
```

Which means, look if the `PORT` environment variable is set, and if so use its value; otherwise use `3000`. Later we'll see several ways of setting environment variables from Node.

## Installing Gulp and Nodemon
With this setup, every time we make changes to our app, we'll have to restart it to make these changes take effect. That becomes annoying pretty fast, so let's take care of it installing a couple of things:
```
$ npm i gulp gulp-nodemon -D
```

Now let's create a simple `gulpfile.js` with these contents:
```js
var gulp    = require('gulp');
var nodemon = require('gulp-nodemon');

gulp.task('default', function () {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      PORT:8000
    },
    ignore: ['./node_modules/**']
  })
  .on('restart', function () {
    console.log('Nodemon restarting server...');
  })
});
```

At the top of the file, we are requiring [Gulp][3] and [gulp-nodemon][4]. Gulp is a task runner, and gulp-nodemon it's a Gulp plugin that allows us to use [Nodemon][5] inside Gulp. Our `default` task uses nodemon to watch our JavaScript files, and when changes are detected, our app will be restarted automatically. In the callback function we're calling `nodemon` and passing a configuration object. In the `script` property we specify the file we want to run, the one that contains our Express server.

> Note the use of the `env` property for setting environment variables from within Node. Here we're setting the `PORT` environment variable, which is gonna be picked up in our `app.js` file.

Another thing we must do is adding the following line to the `scripts` section of our `package.json` file:
```json
"scripts": {
  "start": "gulp"
},
```

With this line in place we just have to run `npm start` from our command line to start the gulp default task, and see our Express server running on port `8000`.

## Basic Routing
So far our app has only a very simple **route**:
```js
app.get('/', function (req, res) {
  res.send('Bookshelf API');
});
```

A **route** has two parts:

* An **endpoint**, which is a **URI** (or path) and a specific **HTTP request method** (GET, POST, and so on).
* A **handler**, which is the code executed when a request hits the endpoint. In this case the handler is an anonymous function which is automatically passed two arguments: a request object (`req`) and a response object (`res`).

  When the **root path** (`/`) receives a `GET` request, we are calling the `send` method on the response object. This method sends the string `'Bookshelf API'`, and automatically sets the `Content-Type` in the headers of the response to `text/html`.

In the next section we'll start implementing the routing for our API.

> Check the [01-getting-started][6] branch to see the current state of the code.

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: intro_rest.md
[next]: get_requests.md


<!-- links -->
[1]: http://expressjs.com/
[2]: https://nodejs.org/api/process.html#process_process_env
[3]: http://gulpjs.com/
[4]: https://www.npmjs.com/package/gulp-nodemon
[5]: http://nodemon.io/
[6]: https://github.com/lifeBalance/bookshelf-API/tree/01-getting-started
