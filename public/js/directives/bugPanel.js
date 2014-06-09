/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global foxographApp:false */

'use strict';

/* Directives */

foxographApp.directive('bugPanel', function ($document, Restangular) {
  return {
    templateUrl: '/r/js/directives/bugPanelTemplate.html',
    restrict: 'E',
    transclude : true,
    replace: true,
    link: function postLink(scope, element, attrs) {

      var MAX_WIDTH = element[0].parentElement.offsetWidth;
      var MAX_HEIGHT = element[0].parentElement.offsetHeight;
      var BUG_WIDTH = 320;
      var BUG_HEIGHT = 40;

      Restangular.restangularizeElement(scope.mockup, scope.bug, "bugs");

      scope.deleteBug = function(bugs, $index) {
        // passing in bugs and destructive modification to avoid
        // climbing mount parent.parent.parent.parent...
        scope.bug.remove();
        bugs.splice($index, 1);
      };

      element[0].onmousedown = function(e) {

        if (scope.auth.email !== scope.project.user) {
          e.stopPropagation();
          return false;
        }

        var bugX = scope.bug.endX;
        var bugY = scope.bug.endY;
        var startX = e.pageX;
        var startY = e.pageY;

        scope.$apply(function() {
          scope.dragging = true;
        });

        $document[0].onmousemove = function(e) {
          scope.$apply(function() {
            scope.bug.endX = Math.max(0, Math.min(MAX_WIDTH - BUG_WIDTH, bugX + (e.pageX - startX)));
            scope.bug.endY = Math.max(0, Math.min(MAX_HEIGHT - BUG_HEIGHT, bugY + (e.pageY - startY)));
          });
          e.stopPropagation();
          return false;
        };

        $document[0].onmouseup = function(e) {
          $document[0].onmousemove = null;
          $document[0].onmouseup = null;

          scope.$apply(function() {
            scope.dragging = false;
          });

          scope.bug.put();

          e.stopPropagation();
          return false;
        };

        e.stopPropagation();
        return false;
      };
    }
  };
});
