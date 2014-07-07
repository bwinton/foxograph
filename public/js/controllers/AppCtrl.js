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
  'AppCtrl': function AppCtrl($scope, $rootScope, Restangular, $filter, $state, $stateParams) {

    // Load in the projects.
    $rootScope.title = 'Foxograph';

    $rootScope.load = function() {
      Restangular.all('projects').getList().then(function (projectList) {
        $rootScope.projects = projectList;
        Restangular.all('bugs').getList().then(function (bugList) {
          var mockups = _.flatten(_.pluck(projectList, 'mockups'));
          projectList = _.map(projectList, function(project) {
            return _.map(project.mockups, function(mockup) {
              mockup.bugs = _.where(bugList, {'mockup': mockup._id});
              return mockup;
            });
          });
        });
      });

      Restangular.all('themes').getList().then(function (themeList) {
        $rootScope.themes = themeList;
      });

      Restangular.all('products').getList().then(function (productList) {
        $rootScope.products = productList;
      });
    };

    $rootScope.load();

    function updateList(listType) {
      if ($rootScope[listType]) {
        var list = $rootScope[listType];

        list = _.reject(list, function(item) {
          return item._id === undefined && _.some(list, function(itemCompare) {
            return item.name === itemCompare.name;
          });
        });

        list = $filter('orderBy')(list, ['name']);

        if (!identical(list, $rootScope[listType])) {
          list = _.map(list, function(item) {
            return Restangular.restangularizeElement(null, item, listType);
          });
          $rootScope[listType] = Restangular.restangularizeCollection(null, list, listType);
        }
      }
    }

    // Keep our themes, products, and projects nice and ordered
    $rootScope.$watch('themes', function() {
      updateList('themes');
    });

    $rootScope.$watch('products', function() {
      updateList('products');
    });

    $rootScope.$watch('projects', function() {
      if (!$rootScope.projects) {
        return;
      }

      updateHeader();

      var projects = $rootScope.projects;

      projects = $filter('orderBy')(projects, ['name', 'user']);

      if (!identical(projects, $rootScope.projects)) {
        $rootScope.projects = projects;
      }
    });

    $rootScope.$on('$stateChangeSuccess', updateHeader);


    // Checks if two collections are identical comparing _id's and names if _id is undefined
    function identical(c1, c2) {
      if (c1.length !== c2.length) {
        return false;
      }

      for (var i = 0; i < c1.length; i++) {
        // check that id's are defined and equal
        // or id's are both undefined and names are equal
        if ((c1[i]._id !== undefined && c2[i]._id !== undefined && c1[i]._id !== c2[i]._id) ||
            (c1[i]._id === c2[i]._id && c1[i].name !== c2[i].name)) { return false; }
      }

      return true;
    }

    function updateHeader() {
      if ($state.params && $state.params.project_slug) {
        $scope.project = _.findWhere($rootScope.projects, {slug: $state.params.project_slug});
        if ($state.params.mockup_slug) {
          $scope.mockup = _.findWhere($scope.project.mockups, {slug: $state.params.mockup_slug});
        } else {
          $scope.mockup = null;
        }
      } else {
        $scope.project = null;
        $scope.mockup = null;
      }
    }
  }
});
