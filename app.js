const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const globals = require('./public/javascripts/GlobalConfig');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');

const app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
const sess = session({
  key: 'session_cookie_chat',
  secret: globals.secretcode,
  store:new MySQLStore({
    host:'152.231.199.159',
    port:3306,
    clearExpired: true,
    checkExpirationInterval: 10000,
    expiration: 10000,
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
});

app.use(sess);
app.set('session',sess);
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
