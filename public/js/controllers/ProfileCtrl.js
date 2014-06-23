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
  'ProfileCtrl': function ProfileCtrl($scope, $rootScope, $location, $stateParams, Restangular, $filter) {

    $rootScope.$watch('projects', function () {
      var userProjects = _.filter($rootScope.projects, {user: $stateParams.user_email});
      $scope.activeProjects = _.filter(userProjects, {archived: false});
      $scope.archivedProjects = _.filter(userProjects, {archived: true});
    });


  }
});
