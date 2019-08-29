const path = require('path');
const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const globalSettings = require(path.resolve('./public/javascripts/GlobalConfig'));
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sockets = require('./public/javascripts/Sockets');
const debug = require('debug')('chat:server');
const http = require('http');

const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');

const app = express();

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const sess = session({
  key: 'session_cookie_chat',
  secret: globalSettings.secretcode,
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
});

const io = require('socket.io')(server);
io.use(function(socket, next) {
  sess(socket.request, socket.request.res, next);
});
io.of('/chat/room_*').on('connect',sockets.OnConnectRoom);
io.of('/chat').on('connect',sockets.OnConnectChat);
app.set('socketio',io);

app.use(sess);
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

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;
