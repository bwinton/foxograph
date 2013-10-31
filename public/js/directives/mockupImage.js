/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false */

'use strict';

/* Directives */

foxographApp.directive('mockupImage', function ($http) {
  var directiveDefinitionObject = {
    restrict: 'E',
    scope: true,

    link: function userPostLink($scope, iElement, iAttrs) {
      var startX = null;
      var startY = null;
      iElement.on('mousedown', function (e) {
        if (e.target !== iElement[0]) {
          return false;
        }
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser || !$scope.background) {
          return false;
        }
        startX = e.pageX;
        startY = e.pageY;
      });
      iElement.on('mouseup', function (e) {
        if (e.target !== iElement[0]) {
          return false;
        }
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser || !$scope.background) {
          return false;
        }
        var bug = prompt('Please enter a bug number');
        if (!bug) {
          return;
        }

        console.log("Adding bug", bug);
        var data = {
          'number': bug,
          'startX': startX,
          'startY': startY,
          'endX': e.pageX,
          'endY': e.pageY
        };
        startX = null;
        startY = null;
        $scope.$apply(function () {
          $scope.addBug(data);
        });
        return false;
      });

      iElement.on('dragover', function () {
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser) {
          return false;
        }
        iElement.addClass('hover');
        return false;
      });
      iElement.on('dragleave', function () {
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser) {
          return false;
        }
        iElement.removeClass('hover');
        return false;
      });
      iElement.on('drop', function (e) {
        e.preventDefault();
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser) {
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
          $scope.$apply(function () {
            $scope.setMockupImage(event.target.result);
          });
        };
        reader.readAsDataURL(file);

        return false;
      });
    }
  };
  return directiveDefinitionObject;
});