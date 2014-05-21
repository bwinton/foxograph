/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true,
  strict:true, undef:true, browser:true, indent:2, maxerr:50, devel:true,
  boss:true, white:true, globalstrict:true, nomen:false, newcap:true*/

/*global _:false, foxographApp:false */

'use strict';

/* Controllers */

foxographApp.controller({

  'ProjectMockupCtrl': function ProjectMockupCtrl($scope, $rootScope, $stateParams, $location, $filter, Restangular, Image) {
    console.log('BW - Setting m_id to ', $stateParams.m_id);
    $rootScope.m_id = $stateParams.m_id;



    $rootScope.$watch('mockups', function () {
      $scope.mockup = _.findWhere($rootScope.mockups, {_id: $rootScope.m_id});
      if (!$scope.mockup) {
        return;
      }

      var mockupIndex = _.indexOf($rootScope.mockups, $scope.mockup);
      $rootScope.prevMockupId = (mockupIndex > 0) ?
                            $rootScope.mockups[mockupIndex - 1]._id : null;
      $rootScope.nextMockupId = (mockupIndex < $rootScope.mockups.length - 1) ?
                            $rootScope.mockups[mockupIndex + 1]._id : null;


      console.log('$scope.mockup = ' + $scope.mockup);
    });

    // Handle changes to the currently selected project.
    // $scope.$watch('bugs', function (bugs) {
    //   setTimeout(function () {
    //     $scope.$apply(function () {
    //       console.log("Running!  1");
    //       run();
    //     });
    //   }, 15);
    // }, true);

    var getMockupStyle = function (mockupImage, $scope) {
      var width = 'width: 100%; ';
      var height = 'height: 100%; ';
      var position = 'background-position: center center; ';
      var imageUrl = '"/r/images/default.png"';
      if (mockupImage) {
        imageUrl = '"/r/images/bugzilla-loading.png"';
      }
      imageUrl = 'background-image: url(' + imageUrl + ');';

      $scope.mockupStyle = width + height + position + imageUrl;
      $rootScope.background = '';

      if (mockupImage) {
        Image.load(mockupImage, $scope).then(function (img) {
          width = 'width: ' + img.width + 'px;';
          height = 'height: ' + img.height + 'px;';
          position = '';
          imageUrl = 'background-image: url("' + mockupImage + '");';
          $scope.mockupStyle = width + height + position + imageUrl;

          var pixel = 'background-color: rgb(' + img.r + ',' + img.g + ',' + img.b + ');';
          $rootScope.background = pixel;
        }, function (err) {
          console.log('Image errored!!!  ' + err);
        });
      }
    };

    $scope.setMockupImage = function (image) {
      $scope.mockup.image = image;
      $scope.mockup.put();
    };

    $scope.setCurrentBug = function (currentBug) {
      $rootScope.bugs = _.reject($rootScope.bugs, function (bug) {
        var rv = bug.current;
        delete bug.current;
        return rv;
      });
      if (currentBug) {
        currentBug.current = true;
        $rootScope.bugs.push(currentBug);
      }
    };

    $scope.addBug = function (bug) {
      $scope.mockup.all('bugs').post(bug).then(function (bug) {
        // Sort the bugs by ['number'].
        bug = bug[0];
        $rootScope.bugs.push(bug);
        $rootScope.bugs = $filter('orderBy')($rootScope.bugs, ['number']);
      }, function (response) {
        console.log('Error with status code', response);
      });
    };

    $scope.deleteBug = function (bug) {
      bug.remove().then(function () {
        $rootScope.bugs = _.without($rootScope.bugs, bug);
      });
    };

    $scope.$on('$destroy', function() {
      $rootScope.background = '';
      $rootScope.m_id = null;
    });

    $scope.$watch('mockup.image', function (image) {
      console.log('Got mockup image of ' + (image ? 'something' : 'nothing'));
      getMockupStyle(image, $scope);
    });
  }

});
