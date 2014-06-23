/*! This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
strict:true, undef:true, unused:true, curly:true, browser:true, white:true,
moz:true, esnext:false, indent:2, maxerr:50, devel:true, node:true, boss:true,
globalstrict:true, nomen:false, newcap:false */

"use strict";

exports.error = function (res, err, console) {
  if (console) {
    console.error(err);
    console.trace(err);
  }
  res.json(console ? 400 : 500, {'error': err});
};

exports.extend = function () {
  var args = Array.prototype.slice.call(arguments);
  var dest = args.shift();
  args.forEach(function (from) {
    var props = Object.getOwnPropertyNames(from);
    props.forEach(function (name) {
      dest[name] = from[name];
    });
  });
  return dest;
};
