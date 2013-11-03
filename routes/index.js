/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

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
