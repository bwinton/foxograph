/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global foxographApp:false */

'use strict';

/* Directives */

foxographApp.directive('mockupImage', function () {
  var directiveDefinitionObject = {
    restrict: 'E',
    scope: true,

    link: function userPostLink($scope, iElement) {
      var bug = null;
      iElement.on('mousedown', function (e) {
        if (e.target !== iElement[0]) {
          return false;
        }
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser || !$scope.background) {
          return false;
        }
        bug = {
          'mockup': $scope.m_id,
          'number': 'Adding…',
          'startX': e.pageX,
          'startY': e.pageY,
          'endX': e.pageX,
          'endY': e.pageY
        };
        $scope.$apply(function () {
          $scope.setCurrentBug(bug);
          console.log($scope.bugs);
        });
      });
      iElement.on('mousemove', function (e) {
        if (e.target !== iElement[0]) {
          return false;
        }
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser || !$scope.background) {
          return false;
        }
        if (!bug) {
          return false;
        }
        console.log('mousemove', bug);
        $scope.$apply(function () {
          bug.endX = e.pageX;
          bug.endY = e.pageY;
        });
      });
      iElement.on('mouseup', function (e) {
        if (e.target !== iElement[0]) {
          return false;
        }
        var validUser = ($scope.auth.email === $scope.project.user);
        if (!validUser || !$scope.background) {
          return false;
        }
        var bugNumber = prompt('Please enter a bug number');

        console.log('Adding bug', bugNumber);
        $scope.$apply(function () {
          var newBug = bug;
          $scope.setCurrentBug(null);
          bug = null;
          if (!bugNumber) {
            return;
          }
          newBug.number = bugNumber;
          $scope.addBug(newBug);
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