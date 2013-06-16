/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, es5:true,
  indent:2, maxerr:50, devel:true, node:true, boss:true, white:true,
  globalstrict:true, nomen:false, newcap:true*/

/*global _:true, foxographApp:true */

'use strict';

/* Filters */

foxographApp.filter('mockupStyle', function styleFactory() {
  return function mockupStyle(mockup) {
    if (!mockup) {
      return "";
    }

    var width = 'width: 100%; ';
    var height = 'height: 100%; ';
    var position = 'background-position: 45%; ';
    var image = '"/r/images/bugzilla-loading.png"';
    if (!mockup.image) {
      image = '"/r/images/default.png"';
    }

    image = 'background-image: url(' + image + ');'

    // {{mockup.width}} {{mockup.height}} {{mockup.position}} {{mockup.image}}
    var out = width + height + position + image;
    return out;
  };
});
