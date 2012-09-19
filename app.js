/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

var app = module.exports = express();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/www');
  app.engine('html', require('ejs').renderFile);
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

var server = app.listen(3000);
console.log("Express server listening on port %d in %s mode", server.address().port, app.settings.env);
