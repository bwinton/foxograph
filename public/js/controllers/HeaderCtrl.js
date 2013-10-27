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

  // The HeaderCtrl handles getting the list of projects, selecting a
  // project, and automatically selecting the appropriate mockup in that
  // project.
  'HeaderCtrl': function HeaderCtrl($scope, $rootScope, Restangular, $filter, $state) {

    $rootScope.mainTitle = 'Please select a project';
    $rootScope.subTitle = '';

    // Load in the projects.
    Restangular.all('projects').getList().then(function (projectList) {
      // Sort the projects by ['name','user'].
      console.log("BW - Loaded projects.");
      $rootScope.projects = $filter('orderBy')(projectList, ['name', 'user']);
    });

    $rootScope.$watch('p_id', function (p_id, old_p_id) {
      console.log("BW - setting selected project.");
      $scope.selectedProject = _.findWhere($rootScope.projects, {_id: p_id});
      $rootScope.mainTitle = 'Please select a project';
      if ($scope.selectedProject) {
        $rootScope.mainTitle = $scope.selectedProject.name;
      }
    });

    // Something about $rootScope.subTitle = $scope.mockup.name;

    $scope.$watch('selectedProject', function (project, oldProject) {
      if (project) {
        // Load in the mockups for that project.
        project.all('mockups').getList().then(function (mockupList) {
          // Sort the projects by ['name','user'].
          console.log("BW - Loaded mockups.");
          $rootScope.mockups = $filter('orderBy')(mockupList, ['creationDate']);
        });

        // $state.go('project', {'p_id': project._id});
      } else {
        $rootScope.mockups = null;
      }
    });

    $scope.createProject = function () {
      $state.go('create', {});
    };

    $scope.addMockup = function (p_id) {
      console.log("Add mockup to:", p_id);
      var title = prompt('Please enter a title for the new mockup.');
      if (!title) {
        return;
      }
      var project = $scope.selectedProject;
      project.all('mockups').post({name: title}).then(function (mockup) {
        project.getList('mockups').then(function (mockupList) {
          console.log("Going to the newly created ", mockup);
          $rootScope.mockups = mockupList;
          $state.go('project', {'p_id': project._id, 'm_id': mockup._id});
        });
      });
    };

  }
});
