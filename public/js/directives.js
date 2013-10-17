/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false, bugzilla:false */

'use strict';

/* Directives */

foxographApp.directive('mockupImage', function ($http) {
  var directiveDefinitionObject = {
    restrict: 'A',
    scope: false,

    link: function userPostLink(scope, iElement, iAttrs) {
      var startX = null;
      var startY = null;
      iElement.on('mousedown', function (e) {
        if ((scope.email !== scope.project.user) ||
            !scope.background) {
          return false;
        }
        startX = e.pageX;
        startY = e.pageY;
      });
      iElement.on('mouseup', function (e) {
        if ((scope.email !== scope.project.user) ||
            !scope.background) {
          return false;
        }
        var bug = prompt('Please enter a bug number');
        if (!bug) {
          return;
        }

        function bugExists()
        {
          var data = {
            'number': bug,
            'startX': startX,
            'startY': startY,
            'endX': e.pageX,
            'endY': e.pageY
          };
          startX = null;
          startY = null;
          scope.$apply(function () {
            scope.addBug(data);
          });
        }
        function bugDoesNotExist()
        {
          alert('The bug number entered is not valid.\nPlease try again.');
        }
        bugzilla.getBug(bug, bugExists, bugDoesNotExist);
        return false;
      });

      iElement.on('dragover', function () {
        if (scope.email !== scope.project.user) {
          return false;
        }
        iElement.addClass('hover');
        return false;
      });
      iElement.on('dragleave', function () {
        if (scope.email !== scope.project.user) {
          return false;
        }
        iElement.removeClass('hover');
        return false;
      });
      iElement.on('drop', function (e) {
        e.preventDefault();
        if (scope.email !== scope.project.user) {
          return false;
        }

        iElement.removeClass('hover');

        var data = e.dataTransfer;
        if (!data) {
          data = e.originalEvent.dataTransfer;
        }

        var file = data.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
          scope.$apply(function () {
            scope.setMockupImage(event.target.result);
          });
        };
        reader.readAsDataURL(file);

        return false;
      });
    }
  };
  return directiveDefinitionObject;
});