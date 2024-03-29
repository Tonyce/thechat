var http = require('http');

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//加入connect中间件，保持会话使用
var connect = require('connect');
// var session = require('session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var sessionStore = new connect.session.MemoryStore();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('somesuperspecialsecrethere'));

//使用connect存储会话
app.use(connect.session({ key:'express.sid', store: sessionStore}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var server = http.createServer(app).listen( process.env.PORT || 3000, function(){
    console.log('Express has start 3000');
    
});

var socket = require('./routes/sockets.js');
socket.initialize(server);
