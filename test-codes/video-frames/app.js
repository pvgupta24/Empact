var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ffmpeg = require('ffmpeg');


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// hi trying this
/*	try {
		var process = new ffmpeg('./public/mov_bbb.mp4');
		process.then(function (video) {
			// Callback mode
			video.fnExtractFrameToJPG('./public/images/', {
				frame_rate : 1,
				number : 100,
				file_name : 'my_frame_%t_%s'
			}, function (error, files) {
				console.log("hi");
				if (!error)
				{
					console.log("here?");
					console.log('Frames: ' + files);
				}
				else
				{
					console.log(error);
				}
			});
		}, function (err) {
			console.log('Error: ' + err);
		});
	} catch (e) {
		console.log(e.code);
		console.log(e.msg);
	}*/


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
