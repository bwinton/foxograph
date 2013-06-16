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

foxographApp.filter('bugLineStyle', function styleFactory() {
  return function bugLineStyle(bug) {
    if (!bug) {
      return '';
    }

    // Move the ending line down a little so that it ends up near the middle of the div.
    var endX = bug.endX + 25;
    var endY = bug.endY + 50;

    // Set up some intermediate variables to calculate with.
    var width = endX - bug.startX;
    var height = endY - bug.startY;
    var length = Math.sqrt(width * width + height * height);
    var angle = Math.atan2(height, width);

    // And finally make the css rules.
    var top = 'top:' + bug.startY + 'px; ';
    var left = 'left:' + bug.startX + 'px; ';
    var transform = 'transform:rotate(' + angle + 'rad) scaleX(' + length + '); ';

    // top:{{bug.startY}}px; left:{{bug.startX}}px; transform: rotate({{angle}}rad) scaleX({{length}});
    var out = top + left + transform;
    return out;
  };
});
