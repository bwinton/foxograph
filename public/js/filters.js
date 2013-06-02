/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global angular:true */

'use strict';

/* Filters */

angular.module('myApp.filters', [])
  .filter('interpolate', ['version', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }]);