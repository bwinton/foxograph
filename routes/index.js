"use strict";


/*
 * GET home page.
 */

exports.index = function (req, res) {
  res.render('index.html');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name + '.html');
};

var extend = require('./api-utils').extend;
var admin = require('./api-admin');
var data = require('./api-data');
extend(exports, admin);
extend(exports, data);
