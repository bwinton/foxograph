"use strict";

/**
 * Module dependencies.
 */

var ejs = require('ejs');
var express = require('express');
var mongoose = require('mongoose');
var routes = require('./routes');
var url = require('url');

var app = module.exports = express();

var logTmpl = ejs.compile('<%= date %> (<%= response_time %>ms): ' +
                          '<%= status %> <%= method %> <%= url %>');

// Configuration

var mongo_url = 'mongodb://localhost/my_database';
if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var mongo_data = services.mongodb[0].credentials;
  mongo_url = 'mongodb://' + mongo_data.username + ':' + mongo_data.password +
              '@' + mongo_data.host + ':' + mongo_data.port + '/' + mongo_data.db;
} else if (process.env.MONGO_URL) {
  mongo_url = process.env.MONGO_URL;
}
mongoose.connect(mongo_url);
console.log("Mongo URL:", mongo_url);

var session_secret = 'mytestsessionsecret';
if (process.env.SESSION_SECRET) {
  session_secret = process.env.SESSION_SECRET;
}
console.log("Session Secret:", session_secret);

var PORT = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
var HOST = process.env.IP_ADDRESS || process.env.VCAP_APP_HOST || '127.0.0.1';
console.log("Port:", PORT);
console.log("Host:", HOST);

var audience = 'http://' + HOST + ':' + PORT; // Must match your browser's address bar
if (process.env.VMC_APP_INSTANCE) {
  var instance = JSON.parse(process.env.VMC_APP_INSTANCE);
  audience = 'https://' + instance.uris[0] + '/';
} else if (process.env.AUDIENCE) {
  audience = process.env.AUDIENCE;
}
console.log("Audience:", audience);

app.configure(function(){
  app.set('views', __dirname + '/views');
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

      // Print the log
      //if (res.statusCode != 200 && res.statusCode != 304)
      console.log(logTmpl(req.kvLog));
    };

    next();
  });
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: session_secret}));
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// API Projects.
app.get('/api/projects', routes.getProjects);
app.post('/api/projects', routes.postProject);
app.get('/api/projects/:project_id', routes.getProject);
app.delete('/api/projects/:project_id', routes.deleteProject);

// API Mockups.
app.get('/api/projects/:project_id/mockups', routes.getMockups);
app.post('/api/projects/:project_id/mockups', routes.postMockup);
app.get('/api/mockups/:mockup_id', routes.getMockup);
app.put('/api/mockups/:mockup_id', routes.putMockup);

// API Bugs
app.get('/api/projects/:project_id/bugs', routes.getBugs);
app.get('/api/projects/:project_id/mockups/:mockup_id/bugs', routes.getBugs);
app.post('/api/bugs', routes.postBug);
app.get('/api/bugs/:bug_id', routes.getBug);
app.delete('/api/bugs/:bug_id', routes.deleteBug);

// API Admin
app.get('/api/deleteAll', routes.deleteAll);
app.get('/api/dump', routes.dump);

// Persona API.
app.get('/user', routes.getUser);
app.post('/logout', routes.logout);

// Static files.
app.use('/r', express.static(__dirname + '/www'));

// User-facing routes.
app.get('/', routes.index);
app.get('/:project_id', routes.index);
app.get('/:project_id/:mockup_id', routes.index);


require('express-persona')(app, {
  audience: audience
});

app.listen(PORT, HOST, function() {
  console.log('Listening on ' + audience);
});
