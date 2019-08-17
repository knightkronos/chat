var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var globals = require('./public/javascripts/GlobalConfig');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var chatRouter = require('./routes/chat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'session_cookie_spacez',
  secret: globals.secretcode,
  store:new MySQLStore({
    host:'152.231.199.159',
    port:3306,
    clearExpired: true,
    checkExpirationInterval: 10000,
    expiration: 60000,
    user:'chat-user',
    password:'chatfcoleo',
    database:'chat-db',
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    }}),
  resave: false,
  saveUninitialized: false
}));

app.use('/', indexRouter);
app.use('/chat', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
