var mongoose = require('mongoose');

/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.sendfile('www/index.html');
};

var Mockup = mongoose.model('Mockup', new mongoose.Schema({
  name: String
}));

exports.getMockups = function(req, res) {
  return Mockup.find(function(err, mockups) {
    return res.json(mockups);
  });
};

exports.postMockup = function(req, res) {
  if (!req.body || !req.body.name)
    return res.json({"error": "Missing name."});
  var mockup = new Mockup({name: req.body.name});
  mockup.save(function (err) {
    if (!err) {
      return console.log("created");
    }
  });
  return res.send(mockup);
};