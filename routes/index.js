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


exports.getBugs = function(req, res) {
  console.log("Looking for bugs for mockup "+req.params.mockup_id+", page "+req.params.page_id);
  return Bug.find({mockup: req.params.mockup_id, Page: req.params.page_id}, function(err, bugs) {
    console.log(JSON.stringify(bugs));
    return res.json(bugs);
  });
};

exports.postBug = function(req, res) {
  if (!req.body || !req.body.number)
    return res.json({"error": "Missing number."});
  console.log("Creating bug:");
  console.log(req.body);
  var bug = new Bug({number: req.body.number});
  console.log(bug);
  bug.save(function (err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(bug);
};


exports.getPages = function(req, res) {
  console.log("Looking for pages for mockup "+req.params.mockup_id);
  return Page.find({mockup: req.params.mockup_id}, function(err, pages) {
    console.log(JSON.stringify(pages));
    return res.json(pages);
  });
};

exports.postPage = function(req, res) {
  if (!req.body || !req.body.image)
    return res.json({"error": "Missing image."});
  console.log("Creating page:");
  console.log(req.body);
  var page = new Page({image: req.body.image, mockup: req.params.mockup_id});
  console.log(page);
  page.save(function (err) {
    console.log(err);
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(page);
};


exports.getMockups = function(req, res) {
  return Mockup.find(function(err, mockups) {
    console.log(JSON.stringify(mockups));
    return res.json(mockups);
  });
};

exports.postMockup = function(req, res) {
  if (!req.body || !req.body.name)
    return res.json({"error": "Missing name."});
  console.log("Creating mockup:");
  console.log(req.body);
  var mockup = new Mockup({name: req.body.name});
  console.log(mockup);
  mockup.save(function (err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(mockup);
};
