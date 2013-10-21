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

  'NewMockupCtrl': function NewMockupCtrl($scope, $rootScope, $location, $route, Restangular) {
    $rootScope.mainTitle = 'Create a new project';
    $rootScope.subTitle = '';
    $scope.project = {};
    $scope.create = function (newProject) {
      var projects = Restangular.all('projects');
      projects.post({name: newProject.name}).then(function (project) {
        project.post('mockups', {name: newProject.mockup}).then(function (mockup) {
          projects.getList().then(function (projectList) {
            $scope.$parent.loadProjects(project._id);
          });
        });
      });
    };
    $scope.reset = function () {
      $scope.project = {};
    };
  }

});
