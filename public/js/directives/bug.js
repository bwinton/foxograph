/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false, bugzilla:false */

'use strict';

/* Directives */

foxographApp.directive('bug', function ($http) {
  return {
    template: '<div></div>',
    restrict: 'E',
    require: 'id',
    scope: false,
    link: function postLink($scope, $iElement, $iAttrs, id) {
      console.log("Creating bug ", id);
      // ngModel.$render = function () {
      //   var value = ngModel.$viewValue || '';
      //   var out = value.toLowerCase().replace(/.|\n/g, function (match) {
      //     return glyphmap[match] || '';
      //   });
      //   $element.html(out);
      // };
    }
  };
});