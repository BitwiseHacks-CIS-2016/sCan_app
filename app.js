var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

routes = require('./routes/index');

var app = express();
var mongoose = require('mongoose');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'branding', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

mongoose.connect(process.env.DATABASE_URL||'mongodb://localhost:27017/sample', function(err) {
    if (err)
        throw err;
    else {
        var CanType = mongoose.model('CanType')
        var District = mongoose.model('District')
        for (var key in routes.district_list) {
            District.findOrCreate({
                _id: key,
                lat: routes.district_list[key][0],
                lng: routes.district_list[key][1]
            }, (err, doc, created) => null)
        }
        for (var key in routes.type_list) {
            District.findOrCreate({
                _id: key,
                color: routes.type_list[key]
            }, (err, doc, created) => null)
        }
    }

});

module.exports = app;
