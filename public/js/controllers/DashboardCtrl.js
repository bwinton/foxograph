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

    $rootScope.title = 'Foxograph Dashboard';

    $scope.filters = {};
    $scope.filters = {
      'themes': [],
      'products': [],
      'archived': false
    };
    $scope.filteredProjects = _.filter($rootScope.projects, {archived: $scope.filters.archived});

    function updateProjectListing() {
      var products = _.pluck($scope.filters.products, '_id');
      var themes = _.pluck($scope.filters.themes, '_id');
      $scope.filteredProjects = _.filter($rootScope.projects, function(project) {
          // if not showing archived, and project is archived filter it
          if (!$scope.filters.archived && project.archived) {
            return false;
          }

          // if we are filtering by products, and project has none of the associated products, filter it
          if (products.length && !_.intersection(_.pluck(project.products, '_id'), products).length) {
            return false;
          }

          // if we are filtering by products, and project has none of the associated products, filter it
          if (themes.length && !_.intersection(_.pluck(project.themes, '_id'), themes).length) {
            return false;
          }

          return true;
      });
    }

    $rootScope.$watch('projects', updateProjectListing, true);
    $scope.$watch('filters', updateProjectListing, true);

    $scope.countBugs = function(mockups) {
      var bugs = _.flatten(_.pluck(mockups, 'bugs'));
      if (bugs.length > 0 && bugs[0] === undefined) {
        return null;
      }
      return _.reject(bugs, function(bug) {return bug === undefined;}).length;
    };

    $scope.toggleArchived = function() {
      $scope.filters.archived = !$scope.filters.archived;
    };
  }
});
