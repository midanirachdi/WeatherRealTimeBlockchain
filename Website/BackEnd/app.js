var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var _ = require("lodash");
var index = require('./routes/index');
var auth = require("./libs/authentication");
var authConfig = require('./libs/jwtConfig');
var passport = require("passport");
var app = express();
var price = require('./api/price');
var cors = require('cors');


//mongoose config :
var db=require('./database_connector/connector');
var users=require('./routes/backOffice/user');
var test=require('./api/testcountry');
//var weatherData=require('./api/weatherData');
var weatherStation=require('./routes/backOffice/weatherStation');
var transaction=require('./routes/backOffice/transaction');
var transactionapi=require('./api/transaction');
var weatherData=require('./routes/frontOffice/weatherData');
var weatherDataApi=require('./api/weatherData');
var login=require('./routes/login/login');
var country=require('./routes/backOffice/country');
var state=require('./routes/backOffice/state');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
var jwtEnable =authConfig.passport.authenticate('jwt', { session: false });
/*var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Expose-Headers', 'Authorization');
    next();
}*/
app.use(cors());
//app.use(allowCrossDomain);
app.use('/', index);
app.use('/users',users);
app.use('/weatherData', weatherData);
app.use('/weatherStation', weatherStation);
app.use('/transaction',  transaction);
app.use('/test',jwtEnable,auth.roleAuthorization(['admin']), test);
app.use('/auth', login);
app.use('/api/weatherData', weatherDataApi);
app.use('/api/transaction', transactionapi);
app.use('/api/price', price);
app.use('/country', country);
app.use('/state', state);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
