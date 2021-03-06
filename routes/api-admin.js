/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

"use strict";

var mongoose = require('mongoose');
var error = require('./api-utils').error;


// The current user.

exports.getUser = function (req, res) {
  console.log('Getting user');
  console.log(JSON.stringify({'email': req.session.email || ''}));
  return res.json({'email': req.session.email || ''});
};

exports.logout = function (req, res) {
  console.log('Logging out');
  delete req.session.email;
  console.log(JSON.stringify({'email': req.session.email || ''}));
  return res.json({'email': req.session.email || ''});
};

// Admin-ish stuff.

exports.deleteAll = function (req, res) {
  console.log('Deleting everything!');
  if (!req.session.email || req.session.email !== 'bwinton@mozilla.com') {
    return error(res, 'Not logged in.');
  }
  mongoose.connection.db.dropDatabase(function (err, result) {
    return res.json(err === null ? 200 : 500, {'result': result});
  });
};
