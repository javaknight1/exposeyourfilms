//=============== set up ===================
//get all the tools we need

var express         = require('express');
var app             = express();
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var methodOverride  = require('method-override');
var mysql           = require('mysql');
var less            = require('less-middleware');
var time            = require('time');
var port            = 3000;
var passport        = require('passport');
var flash           = require('connect-flash');
var mysql           =  require('mysql');                  
var pool            =  mysql.createPool(require('./config/database').connection);


//=============== configuration ===================

require('./config/passport')(passport, pool); // pass passport for configuration

// set favicon
app.use(favicon(__dirname + '/public/images/mini_logo.ico'));

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(methodOverride());
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//less configuration
app.use(less(__dirname + '/public'));

//public file configuration
app.use(express.static(path.join(__dirname, 'public')));

// required for passport
app.use(session({ secret: '7<FB2RO@d8<843q:P6$4Bp08j0E8It', saveUninitialized: true, resave: true} ));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//=============== routes ===================
// setup and configuration for all routes

require('./app/routes.js')(app, passport, pool); // load our routes and pass in our app and fully configured passport

//=============== error handlers ===================
// catch and handle errors

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

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

app.listen(port, function(){
	console.log("Server started at http://localhost:" + port + "...");
});

module.exports = app;
