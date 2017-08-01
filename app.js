var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var request = require('request');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var value ;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(__dirname + '/routes'));
//previous line added to make home page
app.use('/', index);
app.use('/users', users);

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
////////added:
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status( err.code || 500 )
    .json({
      status: 'error',
      message: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  .json({
    status: 'error',
    message: err.message
  });
});

var myJSONObject = {"type":"ldr","timer": "2017-08-01 03:47:00.0:23.400000000000002",  "value":"0.583"};

request({
    url: "https://stark-sierra-48385.herokuapp.com/api/sensors/",
    method: "POST",
    json: true,   // <--Very important!!!
    body: myJSONObject
}
, function (error, response, body){
  console.log(error + ": ERROR!!!!!");
  console.log(response + ": response!!!!!");
  console.log(body + ": body!!!!!");
});
var myJSONObject = {"type":"temp","timer": "2017-08-01 11:47:00.0:23.400000000000002",  "value":"23.83"};

request({
    url: "https://stark-sierra-48385.herokuapp.com/api/sensors/",
    method: "POST",
    json: true,   // <--Very important!!!
    body: myJSONObject
}
, function (error, response, body){
  console.log(error + ": ERROR!!!!!");
  console.log(response + ": response!!!!!");
  console.log(body + ": body!!!!!");
});

/*
request({
    url: "https://stark-sierra-48385.herokuapp.com/api/sensors/ldr",
    method: "GET",

}
, function (error, response, body){
  console.log(error + ": ERROR!!!!!");
  console.log("body!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!: " + body);
  var body = JSON.parse(body);
  value = body.data[0].value;
  console.log("body.data[0]: " + body.data[0]);
  console.log("body.data[0].value: " + body.data[0].value);
    //$('#switch').prop('checked', body.data[0].value);
    //document.getElementById('span1').innerHTML= body.data[0].value;
});
*/
