/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false, bugzilla:false */

'use strict';

/* Directives */

foxographApp.directive('bugPanel', function () {
  var template = '<div class="panel {{bug | statusClass}}"' +
    '    style="top:{{bug.endY - 50}}px; left:{{bug.endX}}px;">' +
    '  <a href="https://bugzilla.mozilla.org/show_bug.cgi?id={{bug.number}}">{{bug.number}}, {{bug.summary}}</a>' +
    '  <br>' +
    '<img src="{{loading}}" ng-hide="bug && bug.status">' +

    '<span ng-show="bug && bug.status" class="{{bug | statusClass}}">{{bug | statusText}}:</span>' +
    '<span ng-show="bug && bug.status" class="{{bug | blockingClass}}">{{bug | blockingText}}</span>, ' +
    '<span ng-show="bug && bug.status" class="{{bug | assignedClass}}">{{bug | assignedText}}</span>' +
    '  <div ng-show="bug && bug.status" ng-transclude></div>' +
    '</div>';
  return {
    template: template,
    restrict: 'E',
    scope: {
      bug: '=bug',
      loading: "@loadingImage"
    },
    transclude : true,
    link: function postLink($scope, $iElement, $iAttrs) {
      console.log("Creating bugPanel ", $scope, $iElement, $iAttrs);
    }
  };
});
