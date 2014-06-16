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
  'DashboardCtrl': function DashboardCtrl($scope, $rootScope, $location, $stateParams, Restangular, $filter) {

    // Would be nice to update URL when filtering

    $scope.filteredThemes = [];
    $scope.filteredProducts = [];

    $scope.countBugs = function(mockups) {
      var bugs = _.flatten(_.pluck(mockups, 'bugs'));
      if (bugs.length > 0 && bugs[0] === undefined) {
        return null;
      }
      return _.reject(bugs, function(bug) {return bug === undefined;}).length;
    };
  }
});
