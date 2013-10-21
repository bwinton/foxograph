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
  'HeaderCtrl': function HeaderCtrl($scope, $rootScope, $location, Restangular, $filter) {

    // Load in the projects.
    Restangular.all('projects').getList().then(function (projectList) {
      // Sort the projects by ['name','user'].
      $rootScope.projects = $filter('orderBy')(projectList, ['name', 'user']);
    });

    // Event handlers!
    $scope.setBackground = function setBackground(background) {
      $scope.background = background;
    };

    $scope.onProjectSelect = function onProjectSelect() {
      var project = $scope.selectedProject;
      // If we have no project, that means they selected the "Create New Project" option!
      $location.path('/' + (project ? ('p/' + project._id) : 'create'));
    };
  }

});
