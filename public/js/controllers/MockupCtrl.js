/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false, run:false */

'use strict';

/* Controllers */

foxographApp.controller({

  'MockupCtrl': function MockupCtrl($scope, $route, $routeParams, Restangular, Image) {
    // Handle changes to the currently selected project.
    $scope.$watch('bugs', function (bugs) {
      setTimeout(function () {
        $scope.$apply(function () {
          console.log("Running!  1");
          run();
        });
      }, 15);
    }, true);

    $scope.$watch('project', function (project) {
      if (!project) {
        return;
      }
      project.getList('bugs').then(function (bugList) {
        $scope.bugs = bugList;
      });
    });

    var getMockupStyle = function (mockupImage, $scope) {
      var width = 'width: 100%; ';
      var height = 'height: 100%; ';
      var position = 'background-position: 45%; ';
      var imageUrl = '"/r/images/default.png"';
      if (mockupImage) {
        imageUrl = '"/r/images/bugzilla-loading.png"';
      }
      imageUrl = 'background-image: url(' + imageUrl + ');';

      $scope.mockupStyle = width + height + position + imageUrl;
      $scope.setBackground('');

      if (mockupImage) {
        Image.load(mockupImage, $scope).then(function (img) {
          width = 'width: ' + img.width + 'px;';
          height = 'height: ' + img.height + 'px;';
          position = '';
          imageUrl = 'background-image: url("' + mockupImage + '");';
          $scope.mockupStyle = width + height + position + imageUrl;

          var pixel = 'background-color: rgb(' + img.r + ',' + img.g + ',' + img.b + ');';
          $scope.setBackground(pixel);
        }, function (err) {
          console.log("Image errored!!!  " + err);
        });
      }
    };

    $scope.setMockupImage = function (image) {
      $scope.mockup.image = image;
      $scope.mockup.put();
    };

    $scope.addBug = function (bug) {
      $scope.mockup.all('bugs').post(bug).then(function (bug) {
        console.log(bug);
        $scope.bugs.push(bug);
      });
    };

    // Handle changes to the currently selected mockup.
    $scope.$watch('mockup', function (mockup) {
      if (!mockup) {
        return;
      }

      mockup.getList('bugs').then(function (bugList) {
        mockup.bugs = bugList;
        run();
      });
    });

    $scope.$watch('mockup.image', function (image) {
      console.log("Got mockup image of " + (image ? "something" : "nothing"));
      getMockupStyle(image, $scope);
    });
  }

});
