const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const proxy = require('express-http-proxy');
const app = express();
const fs = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());



app.use('/index.html', function (req, res) {
  const indexFile = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
  let fileString = indexFile.toString().replace('</head>', '<script>developmentMode = true</script></head>');
  res.send(fileString)
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', proxy('http://app.devdino.com'));




app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  console.log(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
