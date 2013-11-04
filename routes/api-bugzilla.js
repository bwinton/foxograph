/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

"use strict";

var request = require('request');


var BASE_URL = "https://api-dev.bugzilla.mozilla.org/latest";
// var BASE_UI_URL = "https://bugzilla.mozilla.org";

exports.getBug = function (id, callback) {
  var options = {
    uri: BASE_URL + '/bug/' + id,
    json: true
  };
  request(options, callback);
};

exports.getInfo = function (bug) {
  // also check parsed json body.error…
  if (bug.error) {
    return {};
  }
  var rv = {
    number: bug.id,
    summary: bug.summary,
    status: bug.status,
    resolution: bug.resolution,
    blocking: '-',
    assigned: bug.assigned_to.real_name,
    last_got: new Date()
  };
  return rv;
};