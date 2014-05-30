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

    

    $rootScope.$watch('projects', loadMockup)

    $scope.$watch('bugs', function() {
      if ($scope.mockup && $scope.bugs) {
        $scope.bugs = Restangular.restangularizeCollection($scope.mockup, $scope.bugs, 'bugs');        
      }
    });

    function loadMockup() {
      if ($rootScope.projects) {
        var project = _.findWhere($rootScope.projects, {slug: $stateParams.project_slug});
        $scope.project = Restangular.restangularizeElement(null, project, 'projects');
        if ($scope.project) {
          var mockup = _.findWhere($scope.project.mockups, {slug: $stateParams.mockup_slug})
          var mockupPromise = $scope.project.one('mockups', mockup._id).get();
          mockupPromise.then(function(mockup) {
            $scope.mockup = mockup;
            $scope.mockup.all('bugs').getList().then(function(bugList) {
              $scope.bugs = bugList
            });
          });
        }
      }
    }

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
      $scope.bugs.post(bug).then(function (bug) {
        bug = bug[0];
        bug = Restangular.restangularizeElement($scope.mockup, bug, "bugs");
        $scope.bugs.push(bug);
        $scope.bugs = $filter('orderBy')($scope.bugs, ['number']);
      }, function (response) {
        console.log('Error with status code', response);
      });
    };

    $scope.deleteBug = function (bug) {
      bug.remove().then(function() {
        console.log("Removed!");
      })
        $scope.bugs = _.without($scope.bugs, bug);
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
