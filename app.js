/**
 * Module dependencies.
 */

var ejs = require('ejs');
var express = require('express');
var routes = require('./routes');
var url = require('url');

var app = module.exports = express();

const logTmpl = ejs.compile('<%= date %> (<%= response_time %>ms): ' +
                            '<%= status %> <%= method %> <%= url %>');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/www');
  app.engine('html', ejs.renderFile);
  app.use(function(req, res, next) {
    var rEnd = res.end;

    // To track response time
    req._rlStartTime = new Date();

    // Setup the key-value object of data to log and include some basic info
    req.kvLog = {
      date: req._rlStartTime.toISOString(),
      method: req.method,
      url: url.parse(req.originalUrl).pathname,
    };

    // Proxy the real end function
    res.end = function(chunk, encoding) {
      // Do the work expected
      res.end = rEnd;
      res.end(chunk, encoding);

      // And do the work we want now (logging!)

      // Save a few more variables that we can only get at the end
      req.kvLog.status = res.statusCode;
      req.kvLog.response_time = (new Date() - req._rlStartTime);

      // Send the log off to winston
      console.log(logTmpl(req.kvLog));
    };

    next();
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/www'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/mockups/', routes.getMockups);

var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
