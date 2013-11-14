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

  // The ProjectsCtrl handles getting the list of projects, selecting a
  // project, and automatically selecting the appropriate mockup in that
  // project.
  'ProjectsCtrl': function ProjectsCtrl($scope, $rootScope, $location, $stateParams, Restangular, $filter) {
    console.log('BW - Setting p_id to ', $stateParams.p_id);
    $rootScope.p_id = $stateParams.p_id;

    // Handle a change in project id by setting the project.
    $rootScope.$watch('p_id', function changeProject(p_id) {
      if (!$rootScope.projects) {
        // Hopefully we'll do this later.
        // We should totally make this into an Ensure clause on the route!!!
        return;
      }
      if (!$rootScope.p_id) {
        $scope.project = null;
        $scope.mockup = null;
        return;
      }
      $scope.project = _.findWhere($rootScope.projects, {_id: $rootScope.p_id});
    });

    // If we have projects, and a p_id, make sure that we've set the project.
    $rootScope.$watch('projects', function ensureProject() {
      console.log('BW - Ensuring project of ', $rootScope.p_id, $rootScope.projects);
      if (!$rootScope.p_id || !$rootScope.projects) {
        return;
      }
      $scope.project = _.findWhere($rootScope.projects, {_id: $rootScope.p_id});
    });


    $scope.deleteProject = function (project) {
      alert('deleting project ' + project.name);
      project.remove().then(function (data) {
        $scope.projects = _.without($scope.projects, project);
        $scope.p_id = null;
      });
    };

    $scope.deleteMockup = function (mockup) {
      var index = _.indexOf($rootScope.mockups, mockup);
      console.log("6 deleting " + mockup._id);
      mockup.remove().then(function (data) {
        $rootScope.mockups = _.without($rootScope.mockups, mockup);
        if (index >= $rootScope.mockups.length) {
          index = $rootScope.mockups.length - 1;
        }
        if (index < 0) {
          index = 0;
        }
        var nextMockup = null;
        if ($rootScope.mockups.length > 0) {
          nextMockup = $rootScope.mockups[index];
        }
      });
    };
  }
});
