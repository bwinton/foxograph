var mongoose = require('mongoose');

/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.sendfile('www/index.html');
};

var Bug = mongoose.model('Bug', new mongoose.Schema({
  number: String,
  x: Number,
  y: Number
}));

var Page = mongoose.model('Page', new mongoose.Schema({
  image: String,
  mockup: String
}));

var Mockup = mongoose.model('Mockup', new mongoose.Schema({
  name: String
}));

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
