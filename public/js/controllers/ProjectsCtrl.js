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

  // The ProjectsCtrl handles getting the list of projects, selecting a
  // project, and automatically selecting the appropriate mockup in that
  // project.
  'ProjectsCtrl': function ProjectsCtrl($scope, $rootScope, $location, $stateParams, Restangular, $filter) {
    $rootScope.$watch('projects', function () {
      $rootScope.p_id = $stateParams.p_id;
      console.log("BW - Setting p_id to ", $rootScope.p_id);

      var project = _.findWhere($scope.projects, {_id: $stateParams.p_id});
    });

    // Handle a change in project id by setting the project.
    $rootScope.$watch('p_id', function changeProject(p_id) {
      if (!$rootScope.projects) {
        return;
      }
      if (!$rootScope.p_id) {
        // $scope.p_id = $scope.projects[0]._id;
        $scope.project = null;
        $scope.mockup = null;
        return;
      }
      $scope.project = _.findWhere($rootScope.projects, {_id: $rootScope.p_id});
    });


    // Handle a change in mockup id by setting the mockup.
    $rootScope.$watch('m_id', function changeMockup() {
      console.log("BW - mockups =", $rootScope.mockups,
        "p_id =", $rootScope.p_id, "m_id =", $rootScope.m_id);
      if (!$rootScope.mockups) {
        return;
      }
      if (!$rootScope.p_id) {
        return;
      }
      if ($rootScope.p_id && !$rootScope.m_id) {
        console.log("2 Setting m_id to " + $rootScope.mockups[0]._id);
        $rootScope.m_id = $rootScope.mockups[0]._id;
        return;
      }
      $scope.mockup = _.findWhere($rootScope.mockups, {_id: $rootScope.m_id});

      if (!$scope.mockup) {
        // Probably an old m_id from a previously-selected project.
        console.log("3 Setting m_id to " + $rootScope.mockups[0]._id);
        $scope.mockup = $rootScope.mockups[0];
        return;
      }
      var mockupIndex = _.indexOf($rootScope.mockups, $scope.mockup);
      $rootScope.prevMockupId = (mockupIndex > 0) ?
                            $rootScope.mockups[mockupIndex - 1]._id : null;
      $rootScope.nextMockupId = (mockupIndex < $rootScope.mockups.length - 1) ?
                            $rootScope.mockups[mockupIndex + 1]._id : null;
      console.log("$scope.mockup = " + $scope.mockup);
    });


    $scope.deleteProject = function (project) {
      alert('deleting project ' + project.name);
      project.remove().then(function (data) {
        $scope.projects = _.without($scope.projects, project);
        $scope.p_id = null;
        console.log("4 Setting m_id to null.");
        // $location.path('/p/' + $rootScope.mockups[0].project);
      });
    };

    $scope.addMockup = function (project) {
      project.all('mockups').post({name: 'Add name here…'}).then(function (mockup) {
        project.getList('mockups').then(function (mockupList) {
          $rootScope.mockups = _.sortBy(mockupList, function (mockup) {
            return mockup.creationDate;
          });
          console.log("5 Setting m_id to " + mockup._id);
          // $location.path('/p/' + mockup.project + '/' + mockup._id);
        });
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
        console.log("6 Setting m_id to " + nextMockup._id);
        // $location.path('/p/' + nextMockup.project + '/' + nextMockup._id);
      });
    };
  }
});
