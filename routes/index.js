var mongoose = require('mongoose');


var Bug = mongoose.model('Bug', new mongoose.Schema({
  number: String,
  x: Number,
  y: Number,
  page: String
}));

var Page = mongoose.model('Page', new mongoose.Schema({
  image: String,
  mockup: String
}));

var Mockup = mongoose.model('Mockup', new mongoose.Schema({
  name: String
}));

/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.sendfile('www/index.html');
};


// The current user.

exports.getUser = function(req, res) {
  return res.json({'email': req.session.email || ''});
};

// Mockups.

exports.getMockups = function(req, res) {
  console.log('Getting all mockups');
  return Mockup.find(function(err, mockups) {
    console.log(JSON.stringify(mockups));
    return res.json(mockups);
  });
};

exports.postMockup = function(req, res) {
  if (!req.session.email)
    return res.json(403, {'error': 'Not logged in.'});
  if (!req.body || !req.body.name)
    return res.json(403, {'error': 'Missing name.'});
  console.log('Creating mockup:');
  console.log(req.body);
  var mockup = new Mockup(req.body);
  console.log(mockup);
  mockup.save(function (err) {
    if (err)
      return console.log('error: ' + err);
  });
  return res.send(mockup);
};

exports.getMockup = function(req, res) {
  console.log('Getting mockup '+req.params.mockup_id);
  return Mockup.find({_id: req.params.mockup_id}, function(err, mockups) {
    if (err)
      return console.log('error: ' + err);
    console.log(JSON.stringify(mockups[0]));
    return res.json(mockups[0]);
  });
};


// Pages.

exports.getPages = function(req, res) {
  console.log('Looking for pages for mockup '+req.params.mockup_id);
  return Page.find({mockup: req.params.mockup_id}, function(err, pages) {
    if (err)
      return console.log('error: ' + err);
    console.log(JSON.stringify(pages));
    return res.json(pages);
  });
};

exports.postPage = function(req, res) {
  if (!req.session.email)
    return res.json(403, {'error': 'Not logged in.'});
  if (!req.body || !req.body.image)
    return res.json(403, {'error': 'Missing image.'});
  console.log('Creating page:');
  console.log(req.body);
  var page = new Page(req.body);
  console.log(page);
  page.save(function (err) {
    if (err)
      return console.log('error: ' + err);
  });
  return res.send(page);
};

exports.getPage = function(req, res) {
  console.log('Getting page '+req.params.page_id);
  return Page.find({_id: req.params.page_id}, function(err, pages) {
    if (err)
      return console.log('error: ' + err);
    console.log(JSON.stringify(pages[0]));
    return res.json(pages[0]);
  });
};

exports.putPage = function(req, res) {
  if (!req.session.email)
    return res.json(403, {'error': 'Not logged in.'});
  if (!req.body || !req.body.image)
    return res.json(403, {'error': 'Missing image.'});
  console.log('Updating page:');
  console.log(req.body);
  var id = req.body._id;
  delete req.body._id;
  Page.update({_id:id}, req.body, function(err, num) {
    if (err)
      return console.log('error: ' + err);
  });
  return res.send();
};


// Bugs.

exports.getBugs = function(req, res) {
  console.log('Looking for bugs for page '+req.params.page_id);
  return Bug.find({page: req.params.page_id}, function(err, bugs) {
    if (err)
      return console.log('error: ' + err);
    console.log(JSON.stringify(bugs));
    return res.json(bugs);
  });
};

exports.postBug = function(req, res) {
  if (!req.session.email)
    return res.json(403, {'error': 'Not logged in.'});
  if (!req.body || !req.body.number)
    return res.json(403, {'error': 'Missing number.'});
  console.log('Creating bug:');
  console.log(req.body);
  var bug = new Bug(req.body);
  console.log(bug);
  bug.save(function (err) {
    if (err)
      return console.log('error: ' + err);
  });
  return res.send(bug);
};

exports.getBug = function(req, res) {
  console.log('Getting bug '+req.params.bug_id);
  return Bug.find({_id: req.params.bug_id}, function(err, bugs) {
    if (err)
      return console.log('error: ' + err);
    console.log(JSON.stringify(bugs));
    return res.json(bugs[0]);
  });
};
