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
  'ProjectShowCtrl': function ProjectShowCtrl($scope, $rootScope, $location, $state, $stateParams, Restangular, $filter) {

    $scope.form = {};

    $rootScope.$watch('projects', function() {
      $scope.project = _.findWhere($rootScope.projects, {slug: $stateParams.project_slug});
      if ($scope.project) {
        $scope.form = Restangular.copy($scope.project);
        $scope.formChanged = false;
      }
    });

    function checkForm() {
      if (!$scope.project) {
        return false;
      }
      if($scope.form.name !== $scope.project.name) return true;

      var projectThemes = _.map($scope.project.themes, function(theme) {return theme._id;});
      var formThemes = _.map($scope.form.themes, function(theme) {return theme._id;});

      var projectProducts = _.map($scope.project.products, function(product) {return product._id;});
      var formProducts = _.map($scope.form.products, function(product) {return product._id;});

      if (_.xor(projectThemes, formThemes).length !== 0 ||
          _.xor(projectProducts, formProducts).length !== 0) {
        return true;
      }
      return false;
    }

    $scope.$watch('form', function() {
      $scope.formChanged = checkForm();
    }, true);

    $scope.addMockup = function() {
      var mockup = {};
      mockup.name = $scope.newMockupName;
      if (mockup.name) {
        Restangular.restangularizeElement($scope.project, mockup, 'mockups');
        mockup.post().then(function(mockup) {
          console.log(mockup);
          mockup.bugs = [];
          $scope.newMockupName = '';
          $scope.project.mockups.push(mockup);
        });
      }
    };

    $scope.updateProject = function() {
      var projectPromise = $scope.form.put();
      projectPromise.then(function(project) {
        var projects = _.without($rootScope.projects, $scope.project);
        projects.push(project);
        $rootScope.projects = projects;

        // add newly created products to rootscope
        var newProducts = _.where(project.products, function(product) {
          return ! _.some($rootScope.products, {_id: product._id});
        });

        // delete any newly created products that were unsaved
        $rootScope.products = _.filter($rootScope.products.concat(newProducts), "_id");


        // add newly created themes to rootscope
        var newThemes = _.where(project.themes, function(theme) {
          return ! _.some($rootScope.themes, {_id: theme._id});
        });

        // delete any newly created themes that were unsaved
        $rootScope.themes = _.filter($rootScope.themes.concat(newThemes), "_id");

        $state.go('app.project.show', {'project_slug': project.slug});
      });
    };

    $scope.$on('$destroy', function() {
      $rootScope.themes = _.filter($rootScope.themes, "_id");
      $rootScope.products = _.filter($rootScope.products, "_id");
    });

    $scope.resolved = function(bugs) {
      return _.where(bugs, function(bug) {
        return bug.status === 'RESOLVED' || bug.status === 'VERIFIED';
      });
    };

    $scope.assigned = function(bugs) {
      return _.where(bugs, function(bug) {
        return (bug.status !== 'RESOLVED' && bug.status !== 'VERIFIED') &&
               bug.assigned !== 'Nobody; OK to take it and work on it';
      });
    };

    $scope.unassigned = function(bugs) {
      return _.where(bugs, function(bug) {
        return (bug.status !== 'RESOLVED' && bug.status !== 'VERIFIED') &&
               bug.assigned === 'Nobody; OK to take it and work on it';
        });
    };


    $scope.deleteProject = function (project) {
      project.remove().then(function (data) {
        $scope.projects = _.without($scope.projects, project);
        $scope.project_id = null;
      });
    };

    $scope.deleteMockup = function (mockup) {
      var index = _.indexOf($rootScope.mockups, mockup);
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
