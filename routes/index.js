"use strict";

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
  name: String,
  creationDate: Date,
  user: String
}));


var error = function(res, err, console) {
  if (console) {
    console.trace(err);
  }
  res.json(console ? 403 : 500, {'error': err});
};


/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.sendfile('www/index.html');
};


// The current user.

exports.getUser = function(req, res) {
  console.log('Getting user');
  console.log(JSON.stringify({'email': req.session.email || ''}));
  return res.json({'email': req.session.email || ''});
};

exports.logout = function(req, res) {
  console.log('Logging out');
  delete req.session.email;
  console.log(JSON.stringify({'email': req.session.email || ''}));
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
    return error(res, 'Not logged in.');
  if (!req.body || !req.body.name)
    return error(res, 'Missing name.');
  console.log('Creating mockup:');
  req.body.user = req.session.email;
  req.body.creationDate = new Date();
  console.log(req.body);
  var mockup = new Mockup(req.body);
  console.log(mockup);
  console.log(mongoose);
  mockup.save(function (err) {
    if (err) {
      return error(res, err, console);
    }
    return res.json(mockup);
  });
};

exports.getMockup = function(req, res) {
  console.log('Getting mockup '+req.params.mockup_id);
  return Mockup.find({_id: req.params.mockup_id}, function(err, mockups) {
    if (err)
      return error(res, err, console);
    console.log(JSON.stringify(mockups[0]));
    return res.json(mockups[0]);
  });
};

exports.deleteMockup = function(req, res) {
  if (!req.session.email)
    return error(res, 'Not logged in.');
  console.log('Deleting mockup '+req.params.mockup_id);
  Mockup.findOne({_id: req.params.mockup_id}, function(err, mockup) {
    if (mockup.user !== req.session.email)
      return error(res, 'Cannot delete mockup you didn’t create!');

    // Delete all the pages and bugs for this mockup.
    Page.find({mockup: req.params.mockup_id}, function(err, pages) {
      if (err)
        return error(res, err, console);
      pages.forEach(function (page) {
        console.log('  Deleting page '+page._id);
        Bug.find({page: page._id}).remove();
      });
    }).remove();

    // Delete the mockup itself!
    Mockup.findOneAndRemove({_id: req.params.mockup_id}, function(err, mockup) {
      if (err)
        return error(res, err, console);
      console.log(JSON.stringify(mockup));
      return res.json(mockup);
    });
  });
};


// Pages.

exports.getPages = function(req, res) {
  console.log('Looking for pages for mockup '+req.params.mockup_id);
  return Page.find({mockup: req.params.mockup_id}, function(err, pages) {
    if (err)
      return error(res, err, console);
    console.log(JSON.stringify(pages));
    return res.json(pages);
  });
};

exports.postPage = function(req, res) {
  if (!req.session.email)
    return error(res, 'Not logged in.');
  if (!req.body || !req.body.image)
    return error(res, 'Missing image.');
  Mockup.findOne({_id: req.body.mockup}, function(err, mockup) {
    if (mockup.user !== req.session.email)
      return error(res, 'Cannot add page to a mockup you didn’t create!');
    console.log('Creating page:');
    console.log(req.body);
    var page = new Page(req.body);
    console.log(page);
    page.save(function (err) {
      if (err)
        return error(res, err, console);
      return res.json(page);
    });
  });
};

exports.getPage = function(req, res) {
  console.log('Getting page '+req.params.page_id);
  return Page.find({_id: req.params.page_id}, function(err, pages) {
    if (err)
      return error(res, err, console);
    console.log(JSON.stringify(pages[0]));
    return res.json(pages[0]);
  });
};

exports.putPage = function(req, res) {
  if (!req.session.email)
    return error(res, 'Not logged in.');
  if (!req.body || !req.body.image)
    return error(res, 'Missing image.');
  Mockup.findOne({_id: req.body.mockup}, function(err, mockup) {
    if (mockup.user !== req.session.email)
      return error(res, 'Cannot update page in a mockup you didn’t create!');
    console.log('Updating page:');
    console.log(req.body);
    var id = req.body._id;
    delete req.body._id;
    Page.update({_id:id}, req.body, function(err, num) {
      if (err)
        return error(res, err, console);
      return res.json({});
    });
  });
};


// Bugs.

exports.getBugs = function(req, res) {
  console.log('Looking for bugs for page '+req.params.page_id);
  return Bug.find({page: req.params.page_id}, function(err, bugs) {
    if (err)
      return error(res, err, console);
    console.log(JSON.stringify(bugs));
    return res.json(bugs);
  });
};

exports.postBug = function(req, res) {
  if (!req.session.email)
    return error(res, 'Not logged in.');
  if (!req.body || !req.body.number)
    return error(res, 'Missing number.');
  Page.findOne({_id: req.body.page}, function(err, page) {
    Mockup.findOne({_id: page.mockup}, function(err, mockup) {
      if (mockup.user !== req.session.email)
        return error(res, 'Cannot add bug to a mockup you didn’t create!');
      console.log('Creating bug:');
      console.log(req.body);
      var bug = new Bug(req.body);
      console.log(bug);
      bug.save(function (err) {
        if (err)
          return error(res, err, console);
        return res.json(bug);
      });
    });
  });
};

exports.getBug = function(req, res) {
  console.log('Getting bug '+req.params.bug_id);
  return Bug.find({_id: req.params.bug_id}, function(err, bugs) {
    if (err)
      return error(res, err, console);
    console.log(JSON.stringify(bugs));
    return res.json(bugs[0]);
  });
};

exports.deleteAll = function(req, res) {
  console.log('Deleting everything!');
  if (!req.session.email || req.session.email !== 'bwinton@mozilla.com')
    return error(res, 'Not logged in.');
  mongoose.connection.db.dropDatabase(function(err, result) {
    return res.json(err === null ? 200 : 500, {'result': result});
  });
};