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

    // Load in the projects.
    Restangular.all('projects').getList().then(function (projectList) {
      // Sort the projects by ['name','user'].
      $rootScope.projects = $filter('orderBy')(projectList, ['name', 'user']);
    });

    $rootScope.$watch('p_id', function (p_id, old_p_id) {
      if (p_id) {
        $scope.selectedProject = _.findWhere($rootScope.projects, {_id: p_id});
      } else {
        $scope.selectedProject = null;
      }
    });

    $scope.$watch('selectedProject', function (project, oldProject) {
      $state.go('project', {'p_id': project ? project._id : null});
    });

    $scope.createProject = function () {
      $state.go('create');
    };

  }
});
