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



    $rootScope.$watch('projects', loadMockup);

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
          var mockup = _.findWhere($scope.project.mockups, {slug: $stateParams.mockup_slug});
          if (!mockup.image) {
            Restangular.restangularizeElement($scope.project, mockup, 'mockups');
            mockup.one('img').get().then(function(image) {
              if (_.isEmpty(image.data)) {
                mockup.image = null;
              } else {
                mockup.image = image.data;
              }
              $scope.mockup = mockup;
            });
          }
          $scope.mockup = mockup;
        }
      }
    }
  }
});
