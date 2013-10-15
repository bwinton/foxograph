"use strict";


/*
 * GET home page.
 */

exports.index = function (req, res) {
  var email;
  if (req.session) {
    email = req.session.email;
  }
  if (email) {
    email = "'" + email + "'";
  }
  res.render('index.html', {email: email});
};

var extend = require('./api-utils').extend;
var admin = require('./api-admin');
var data = require('./api-data');
extend(exports, admin);
extend(exports, data);
